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
 * Cuando se consulta por grupo, incluye:
 * - Juegos asignados directamente al grupo
 * - Juegos personales de todos los miembros del grupo
 */
exports.getGames = async (userId, groupId = null, filters = {}) => {
  const { source, search, page = 1, limit = 20 } = filters;

  let filter = { isActive: true };
  let needsDeduplication = false;

  // Obtener juegos según contexto
  if (groupId) {
    // Obtener el grupo para saber quiénes son los miembros
    const group = await Group.findById(groupId);
    if (!group) {
      throw { status: 404, message: 'Grupo no encontrado' };
    }

    // Obtener IDs de todos los miembros del grupo
    const memberIds = group.members.map(m => m.user);

    // Incluir juegos del grupo Y juegos personales de los miembros
    filter.$or = [
      { group: groupId }, // Juegos asignados al grupo
      { addedBy: { $in: memberIds }, group: null } // Juegos personales de miembros
    ];
    needsDeduplication = true;
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
    const searchFilter = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categories: { $in: [new RegExp(search, 'i')] } },
      ]
    };
    // Combinar con filtros existentes
    filter = { $and: [filter, searchFilter] };
  }

  // Obtener juegos
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const allGames = await Game.find(filter)
    .populate('addedBy', 'name email')
    .populate('group', 'name')
    .sort({ createdAt: -1 });

  // Deduplicar si es necesario (en grupo) - por nombre normalizado para evitar duplicados
  const games = needsDeduplication
    ? this.deduplicateGamesByName(allGames)
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
 * Helper: Generar identificador único para un juego
 * - Para juegos de BGG: usa bggId (más preciso)
 * - Para juegos custom: usa nombre normalizado
 */
exports.getGameIdentifier = (game) => {
  if (game.source === 'bgg' && game.bggId) {
    return `bgg_${game.bggId}`;
  }
  // Para juegos custom, usar nombre normalizado
  return `custom_${game.name.toLowerCase().trim()}`;
};

/**
 * Helper: Deduplicar juegos y recopilar todos los propietarios
 * - Usa bggId para juegos de BGG (más preciso)
 * - Usa nombre normalizado para juegos custom
 * - Prioriza juegos de BGG sobre custom (datos más completos)
 * - Recopila todos los propietarios de juegos duplicados
 */
exports.deduplicateGamesWithOwners = (games) => {
  // Map para agrupar juegos por identificador
  // Estructura: { identifier: { bestGame, owners: Set } }
  const gameGroups = new Map();

  for (const game of games) {
    const identifier = this.getGameIdentifier(game);
    const ownerInfo = game.addedBy ? {
      _id: game.addedBy._id?.toString() || game.addedBy.toString(),
      name: game.addedBy.name || 'Usuario',
      email: game.addedBy.email || ''
    } : null;

    if (gameGroups.has(identifier)) {
      const group = gameGroups.get(identifier);
      
      // Añadir propietario si no está ya en la lista
      if (ownerInfo && !group.ownerIds.has(ownerInfo._id)) {
        group.ownerIds.add(ownerInfo._id);
        group.owners.push(ownerInfo);
      }

      // Determinar si este juego es "mejor" que el actual
      const currentBest = group.bestGame;
      const shouldReplace = this.shouldReplaceGame(currentBest, game);
      
      if (shouldReplace) {
        group.bestGame = game;
      }
    } else {
      // Primer juego con este identificador
      const ownerIds = new Set();
      const owners = [];
      
      if (ownerInfo) {
        ownerIds.add(ownerInfo._id);
        owners.push(ownerInfo);
      }

      gameGroups.set(identifier, {
        bestGame: game,
        owners,
        ownerIds
      });
    }
  }

  // Construir resultado final con propietarios incluidos
  const result = [];
  
  for (const [, group] of gameGroups) {
    // Convertir el juego a objeto plano para poder añadir owners
    const gameObj = group.bestGame.toObject ? group.bestGame.toObject() : { ...group.bestGame };
    
    // Añadir array de propietarios al juego
    gameObj.owners = group.owners;
    
    result.push(gameObj);
  }

  // Ordenar por fecha de creación (más recientes primero)
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Helper: Determinar si un juego debe reemplazar a otro como "mejor" versión
 * Prioridad: BGG con grupo > BGG sin grupo > Custom con grupo > Custom sin grupo
 */
exports.shouldReplaceGame = (current, candidate) => {
  // Si el candidato es de BGG y el actual no, reemplazar
  if (candidate.source === 'bgg' && current.source !== 'bgg') {
    return true;
  }
  
  // Si ambos son del mismo source, preferir el que tiene grupo
  if (candidate.source === current.source) {
    if (candidate.group && !current.group) {
      return true;
    }
  }
  
  // Si el candidato es de BGG con grupo y el actual es BGG sin grupo
  if (candidate.source === 'bgg' && current.source === 'bgg') {
    if (candidate.group && !current.group) {
      return true;
    }
  }
  
  return false;
};

/**
 * Helper: Eliminar duplicados por nombre normalizado (legacy - mantener compatibilidad)
 * @deprecated Usar deduplicateGamesWithOwners en su lugar
 */
exports.deduplicateGamesByName = (games) => {
  return this.deduplicateGamesWithOwners(games);
};
