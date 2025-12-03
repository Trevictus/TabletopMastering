const Game = require('../models/Game');
const Group = require('../models/Group');

/**
 * Proyecciones para consultas de Game
 */
const GAME_LIST_PROJECTION = {
  name: 1,
  image: 1,
  thumbnail: 1,
  minPlayers: 1,
  maxPlayers: 1,
  playingTime: 1,
  categories: 1,
  source: 1,
  bggId: 1,
  'rating.average': 1,
  'stats.timesPlayed': 1,
  addedBy: 1,
  group: 1,
  createdAt: 1,
};

const GAME_DETAIL_PROJECTION = {
  name: 1,
  description: 1,
  image: 1,
  thumbnail: 1,
  minPlayers: 1,
  maxPlayers: 1,
  playingTime: 1,
  minPlayTime: 1,
  maxPlayTime: 1,
  categories: 1,
  mechanics: 1,
  difficulty: 1,
  source: 1,
  bggId: 1,
  yearPublished: 1,
  designer: 1,
  publisher: 1,
  rating: 1,
  stats: 1,
  customNotes: 1,
  addedBy: 1,
  group: 1,
  createdAt: 1,
};

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

  // Verificar si el juego ya existe en el contexto (grupo o personal) - optimizado con lean
  const duplicateFilter = groupId 
    ? { name: name, group: groupId, isActive: true }
    : { name: name, addedBy: userId, group: null, isActive: true };

  const existingGame = await Game.findOne(duplicateFilter)
    .select('_id name')
    .lean();
    
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
 * Cuando se consulta por grupo:
 * - Obtiene los juegos personales de todos los miembros del grupo
 * - Deduplica automáticamente por nombre/bggId
 * Los juegos NO se asignan directamente a grupos, solo a usuarios
 */
exports.getGames = async (userId, groupId = null, filters = {}) => {
  const { source, search, page = 1, limit = 20 } = filters;

  let filter = { isActive: true };
  let needsDeduplication = false;

  if (groupId) {
    // Obtener solo los IDs de miembros del grupo (optimizado)
    const group = await Group.findById(groupId)
      .select('members.user')
      .lean();
      
    if (!group) {
      throw { status: 404, message: 'Grupo no encontrado' };
    }

    // Obtener IDs de todos los miembros del grupo
    const memberIds = group.members.map(m => m.user);

    // Solo juegos personales de los miembros (group = null)
    filter.addedBy = { $in: memberIds };
    filter.group = null;
    needsDeduplication = true;
  } else {
    // Juegos personales del usuario (sin grupo)
    filter.addedBy = userId;
    filter.group = null;
  }

  // Aplicar filtro de fuente si se proporciona
  if (source && ['bgg', 'custom'].includes(source)) {
    filter.source = source;
  }

  // Aplicar búsqueda si se proporciona (optimizado con índice de texto)
  if (search) {
    // Usar $text search si está disponible (más eficiente con índice)
    const searchFilter = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { categories: { $in: [new RegExp(search, 'i')] } },
      ]
    };
    // Combinar con filtros existentes
    filter = { $and: [filter, searchFilter] };
  }

  // Obtener juegos con projection y lean
  const allGames = await Game.find(filter)
    .select(GAME_LIST_PROJECTION)
    .populate('addedBy', 'name email -_id')
    .populate('group', 'name -_id')
    .sort({ createdAt: -1 })
    .lean();

  // Deduplicar si es necesario (en grupo) - por nombre normalizado para evitar duplicados
  const games = needsDeduplication
    ? this.deduplicateGamesByName(allGames)
    : allGames;

  // Aplicar paginación post-deduplicación
  const skip = (parseInt(page) - 1) * parseInt(limit);
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
 * Obtener un juego por ID (optimizado)
 */
exports.getGameById = async (gameId, userId = null) => {
  const game = await Game.findOne({ _id: gameId, isActive: true })
    .select(GAME_DETAIL_PROJECTION)
    .populate('addedBy', 'name email avatar')
    .populate('group', 'name description avatar')
    .lean();

  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  // Verificar acceso si tiene grupo
  if (game.group && userId) {
    const groupId = game.group._id || game.group;
    const group = await Group.findById(groupId)
      .select('admin members.user')
      .lean();
      
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
 * Actualizar un juego (optimizado)
 */
exports.updateGame = async (gameId, updates, userId) => {
  let game = await Game.findOne({ _id: gameId, isActive: true })
    .select('source group addedBy');

  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  // Verificar permisos (solo si tiene grupo)
  if (game.group) {
    const group = await Group.findById(game.group)
      .select('members')
      .lean();
      
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
 * Eliminar un juego (soft delete) - optimizado
 */
exports.deleteGame = async (gameId, userId) => {
  const game = await Game.findOne({ _id: gameId, isActive: true })
    .select('group addedBy');

  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  // Verificar permisos
  if (game.group) {
    const group = await Group.findById(game.group)
      .select('members')
      .lean();
      
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

  // Soft delete usando updateOne (más eficiente)
  await Game.updateOne({ _id: gameId }, { isActive: false });

  return game;
};

/**
 * Obtener estadísticas de juegos de un grupo (optimizado con agregación)
 */
exports.getGroupStats = async (groupId) => {
  // Usar agregación para obtener múltiples estadísticas en una sola query
  const statsAggregation = await Game.aggregate([
    { $match: { group: groupId, isActive: true } },
    {
      $facet: {
        // Conteo total y por fuente
        totals: [
          {
            $group: {
              _id: '$source',
              count: { $sum: 1 }
            }
          }
        ],
        // Top rated
        topRated: [
          { $sort: { 'rating.average': -1 } },
          { $limit: 5 },
          { $project: { name: 1, 'rating.average': 1, image: 1 } }
        ],
        // Most played
        mostPlayed: [
          { $sort: { 'stats.timesPlayed': -1 } },
          { $limit: 5 },
          { $project: { name: 1, 'stats.timesPlayed': 1, image: 1 } }
        ],
        // Categories stats
        categories: [
          { $unwind: '$categories' },
          { $group: { _id: '$categories', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]
      }
    }
  ]);

  const stats = statsAggregation[0];
  
  // Procesar conteos por fuente
  const sourceCounts = { bgg: 0, custom: 0 };
  let totalGames = 0;
  
  stats.totals.forEach(item => {
    if (item._id === 'bgg') sourceCounts.bgg = item.count;
    else if (item._id === 'custom') sourceCounts.custom = item.count;
    totalGames += item.count;
  });

  return {
    totalGames,
    total: totalGames, // Mantener retrocompatibilidad
    bySource: sourceCounts,
    topRated: stats.topRated,
    mostPlayed: stats.mostPlayed,
    topCategories: stats.categories.map(c => ({ name: c._id, count: c.count })),
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
