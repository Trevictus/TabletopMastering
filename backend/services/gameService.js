const Game = require('../models/Game');
const Group = require('../models/Group');

/**
 * Crear un juego personalizado
 */
exports.createCustomGame = async (gameData, userId, groupId = null) => {
  const {
    name,
    description,
    image,
    minPlayers,
    maxPlayers,
    playingTime,
    categories,
    mechanics,
    difficulty,
    yearPublished,
    customNotes,
  } = gameData;

  // Validaciones
  if (!name) {
    throw new Error('El nombre del juego es obligatorio');
  }

  if (!minPlayers || !maxPlayers) {
    throw new Error('El número de jugadores es obligatorio');
  }

  // Verificar si el juego ya existe en el contexto (grupo o personal)
  const duplicateFilter = groupId 
    ? { name: name, group: groupId, isActive: true }
    : { name: name, addedBy: userId, group: null, isActive: true };

  const existingGame = await Game.findOne(duplicateFilter);
  if (existingGame) {
    throw { 
      status: 400, 
      message: 'Este juego ya está en la colección',
      data: existingGame 
    };
  }

  // Crear juego personalizado
  const game = await Game.create({
    name,
    description: description || '',
    image: image || undefined,
    minPlayers,
    maxPlayers,
    playingTime: playingTime || 0,
    categories: categories || [],
    mechanics: mechanics || [],
    difficulty: difficulty || '',
    yearPublished,
    group: groupId || null,
    addedBy: userId,
    source: 'custom',
    customNotes: customNotes || '',
    isActive: true,
  });

  // Verificar que el juego se guardó correctamente y popularlo
  const savedGame = await Game.findById(game._id)
    .populate('addedBy', 'name email')
    .populate('group', 'name');

  if (!savedGame) {
    throw new Error('Error al guardar el juego en la base de datos');
  }

  return savedGame;
};

/**
 * Obtener juegos (personales o por grupo sin duplicados)
 */
exports.getGames = async (userId, groupId = null, filters = {}) => {
  const { source, search, page = 1, limit = 20 } = filters;

  let filter = { isActive: true };
  let deduplicationField = null;

  // Obtener juegos según contexto
  if (groupId) {
    // Juegos del grupo (sin duplicados por bggId)
    filter.group = groupId;
    deduplicationField = 'bggId'; // Deduplicar por bggId si existe
  } else {
    // Juegos personales (sin grupo)
    filter.addedBy = userId;
    filter.group = null;
  }

  // Aplicar filtro de fuente si se proporciona
  if (source && ['bgg', 'custom'].includes(source)) {
    filter.source = source;
  }

  // Aplicar búsqueda si se proporciona
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { categories: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  // Obtener juegos
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const allGames = await Game.find(filter)
    .populate('addedBy', 'name email')
    .populate('group', 'name')
    .sort({ createdAt: -1 });

  // Deduplicar si es necesario (en grupo)
  const games = deduplicationField 
    ? this.deduplicateGames(allGames, deduplicationField)
    : allGames;

  // Aplicar paginación post-deduplicación
  const paginatedGames = games.slice(skip, skip + parseInt(limit));
  const total = games.length;

  return {
    games: paginatedGames,
    count: paginatedGames.length,
    total,
    pages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  };
};

/**
 * Obtener un juego por ID
 */
exports.getGameById = async (gameId, userId = null) => {
  const game = await Game.findOne({ _id: gameId, isActive: true })
    .populate('addedBy', 'name email avatar')
    .populate('group', 'name description avatar');

  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  // Verificar acceso si tiene grupo
  if (game.group) {
    const group = await Group.findById(game.group._id);
    const isAdmin = group.admin.toString() === userId.toString();
    const isMember = group.members.some(
      member => member.user.toString() === userId.toString()
    );

    if (!isAdmin && !isMember) {
      throw { status: 403, message: 'No tienes acceso a este juego' };
    }
  }

  return game;
};

/**
 * Actualizar un juego
 */
exports.updateGame = async (gameId, updates, userId) => {
  let game = await Game.findOne({ _id: gameId, isActive: true });

  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  // Verificar permisos (solo si tiene grupo)
  if (game.group) {
    const group = await Group.findById(game.group);
    const member = group.members.find(
      m => m.user.toString() === userId.toString()
    );

    if (!member) {
      throw { 
        status: 403, 
        message: 'No tienes permisos para editar este juego' 
      };
    }

    // Solo admin puede editar, o el usuario que lo añadió
    if (member.role !== 'admin' && game.addedBy.toString() !== userId.toString()) {
      throw { 
        status: 403, 
        message: 'Solo el administrador o quien añadió el juego puede editarlo' 
      };
    }
  }

  // Campos permitidos para editar según el source
  let allowedFields;
  
  if (game.source === 'bgg') {
    // Para juegos de BGG, solo permitir editar campos personalizados
    allowedFields = ['customNotes', 'difficulty', 'image'];
  } else {
    // Para juegos custom, permitir editar todo excepto source y bggId
    allowedFields = [
      'name', 'description', 'image', 'minPlayers', 'maxPlayers',
      'playingTime', 'minPlayTime', 'maxPlayTime', 'categories', 'mechanics',
      'difficulty', 'yearPublished', 'customNotes'
    ];
  }

  // Filtrar campos permitidos
  const filteredUpdates = {};
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  game = await Game.findByIdAndUpdate(
    gameId,
    filteredUpdates,
    { new: true, runValidators: true }
  )
    .populate('addedBy', 'name email')
    .populate('group', 'name');

  // Verificar que la actualización fue exitosa
  if (!game) {
    throw new Error('Error al actualizar el juego en la base de datos');
  }

  return game;
};

/**
 * Eliminar un juego (soft delete)
 */
exports.deleteGame = async (gameId, userId) => {
  const game = await Game.findOne({ _id: gameId, isActive: true });

  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  // Verificar permisos
  if (game.group) {
    const group = await Group.findById(game.group);
    const member = group.members.find(
      m => m.user.toString() === userId.toString()
    );

    if (!member) {
      throw { 
        status: 403, 
        message: 'No tienes permisos para eliminar este juego' 
      };
    }

    // Solo admin puede eliminar, o el usuario que lo añadió
    if (member.role !== 'admin' && game.addedBy.toString() !== userId.toString()) {
      throw { 
        status: 403, 
        message: 'Solo el administrador o quien añadió el juego puede eliminarlo' 
      };
    }
  }

  // Soft delete
  game.isActive = false;
  await game.save();

  return game;
};

/**
 * Obtener estadísticas de juegos de un grupo
 */
exports.getGroupStats = async (groupId) => {
  // Obtener estadísticas
  const totalGames = await Game.countDocuments({ group: groupId, isActive: true });
  const bggGames = await Game.countDocuments({ group: groupId, source: 'bgg', isActive: true });
  const customGames = await Game.countDocuments({ group: groupId, source: 'custom', isActive: true });
  
  const topRatedGames = await Game.find({ group: groupId, isActive: true })
    .sort({ 'rating.average': -1 })
    .limit(5)
    .select('name rating.average image');

  const mostPlayedGames = await Game.find({ group: groupId, isActive: true })
    .sort({ 'stats.timesPlayed': -1 })
    .limit(5)
    .select('name stats.timesPlayed image');

  const categoriesStats = await Game.aggregate([
    { $match: { group: groupId, isActive: true } },
    { $unwind: '$categories' },
    { $group: { _id: '$categories', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return {
    totalGames: totalGames,
    total: totalGames, // Mantener retrocompatibilidad
    bySource: {
      bgg: bggGames,
      custom: customGames,
    },
    topRated: topRatedGames,
    mostPlayed: mostPlayedGames,
    topCategories: categoriesStats.map(c => ({ name: c._id, count: c.count })),
  };
};

/**
 * Helper: Eliminar duplicados manteniendo el primer registro único
 */
exports.deduplicateGames = (games, field) => {
  const seen = new Set();
  return games.filter(game => {
    // Para juegos de BGG, usar bggId
    const identifier = game[field] || `custom_${game._id}`;
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
};
