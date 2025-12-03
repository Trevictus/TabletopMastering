const Game = require('../models/Game');
const Group = require('../models/Group');
const bggService = require('./bggService');

/**
 * Servicio de gestión de juegos de mesa
 * Utiliza datos simulados (mock) para búsquedas y detalles de juegos
 */

/**
 * Validar y obtener acceso al grupo para operaciones (optimizado)
 */
exports.validateGroupAccess = async (groupId, userId) => {
  if (!groupId) {
    return null;
  }

  const group = await Group.findById(groupId)
    .select('admin members.user')
    .lean();
    
  if (!group) {
    throw { status: 404, message: 'Grupo no encontrado' };
  }

  const isAdmin = group.admin.toString() === userId.toString();
  const isMember = group.members.some(
    member => member.user.toString() === userId.toString()
  );

  if (!isAdmin && !isMember) {
    throw { status: 403, message: 'No eres miembro de este grupo' };
  }

  return group;
};

/**
 * Buscar juegos en la base de datos simulada (sin guardar)
 */
exports.searchBGGGames = async (name, exact = false) => {
  if (!name) {
    throw new Error('El parámetro "name" es obligatorio');
  }

  const results = await bggService.searchGames(name, exact);

  return results;
};

/**
 * Obtener detalles de un juego por ID
 */
exports.getBGGGameDetails = async (bggId) => {
  if (!bggId || isNaN(bggId)) {
    throw new Error('ID de juego inválido');
  }

  const gameDetails = await bggService.getGameDetails(parseInt(bggId));

  return gameDetails;
};

/**
 * Añadir un juego desde la base de datos (optimizado)
 */
exports.addBGGGame = async (bggId, userId, groupId = null, customNotes = '') => {
  // Validaciones
  if (!bggId) {
    throw new Error('El ID del juego es obligatorio');
  }

  // Verificar que el grupo existe y el usuario es miembro o admin (si se proporciona)
  if (groupId) {
    const group = await Group.findById(groupId)
      .select('admin members.user')
      .lean();
      
    if (!group) {
      throw { status: 404, message: 'Grupo no encontrado' };
    }

    const isAdmin = group.admin.toString() === userId.toString();
    const isMember = group.members.some(
      member => member.user.toString() === userId.toString()
    );

    if (!isAdmin && !isMember) {
      throw { status: 403, message: 'No eres miembro de este grupo' };
    }

    // Verificar si el juego ya existe en el grupo (optimizado con exists)
    const existingGame = await Game.findOne({ 
      bggId: bggId, 
      group: groupId,
      isActive: true 
    })
      .select('_id name')
      .lean();

    if (existingGame) {
      throw { 
        status: 400, 
        message: 'Este juego ya está en la colección del grupo',
        data: existingGame,
      };
    }
  } else {
    // Si no hay grupo, verificar si el usuario ya tiene este juego de forma personal
    const existingGame = await Game.findOne({ 
      bggId: bggId, 
      addedBy: userId,
      group: null,
      isActive: true 
    })
      .select('_id name')
      .lean();

    if (existingGame) {
      throw { 
        status: 400, 
        message: 'Ya tienes este juego en tu colección personal',
        data: existingGame,
      };
    }
  }

  // Obtener detalles del juego desde BGG
  const bggData = await bggService.getGameDetails(parseInt(bggId));

  // Crear el juego en la base de datos
  const game = await Game.create({
    ...bggData,
    group: groupId || null,
    addedBy: userId,
    customNotes: customNotes || '',
    isActive: true,
  });

  // Verificar que el juego se guardó y devolver con populate mínimo
  const savedGame = await Game.findById(game._id)
    .select('name image thumbnail minPlayers maxPlayers source bggId addedBy group createdAt')
    .populate('addedBy', 'name -_id')
    .populate('group', 'name -_id')
    .lean();

  if (!savedGame) {
    throw new Error('Error al guardar el juego en la base de datos');
  }

  return savedGame;
};

/**
 * Sincronizar juego de BGG (actualizar datos) - optimizado
 */
exports.syncBGGGame = async (gameId, userId) => {
  const game = await Game.findOne({ _id: gameId, isActive: true })
    .select('source bggId group');

  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  if (game.source !== 'bgg') {
    throw new Error('Este endpoint solo funciona con juegos de BGG');
  }

  // Verificar permisos si tiene grupo
  if (game.group) {
    const group = await Group.findById(game.group)
      .select('admin members.user')
      .lean();
      
    const isAdmin = group.admin.toString() === userId.toString();
    const isMember = group.members.some(
      m => m.user.toString() === userId.toString()
    );

    if (!isAdmin && !isMember) {
      throw { 
        status: 403, 
        message: 'No tienes permisos para sincronizar este juego' 
      };
    }
  }

  // Obtener datos actualizados de BGG
  const bggData = await bggService.getGameDetails(game.bggId);

  // Usar findByIdAndUpdate para una actualización atómica y eficiente
  const updatedGame = await Game.findByIdAndUpdate(
    gameId,
    {
      $set: {
        name: bggData.name,
        description: bggData.description,
        image: bggData.image,
        thumbnail: bggData.thumbnail,
        yearPublished: bggData.yearPublished,
        minPlayers: bggData.minPlayers,
        maxPlayers: bggData.maxPlayers,
        playingTime: bggData.playingTime,
        minPlayTime: bggData.minPlayTime,
        maxPlayTime: bggData.maxPlayTime,
        categories: bggData.categories,
        mechanics: bggData.mechanics,
        designer: bggData.designer,
        publisher: bggData.publisher,
        rating: bggData.rating,
        bggLastSync: new Date(),
      }
    },
    { new: true }
  )
    .populate('addedBy', 'name -_id')
    .populate('group', 'name -_id')
    .lean();

  if (!updatedGame) {
    throw new Error('Error al sincronizar el juego con BGG');
  }

  return updatedGame;
};

/**
 * Obtener juegos populares de BGG
 */
exports.getHotGames = async (limit = 10) => {
  const hotGames = await bggService.getHotGames(parseInt(limit));

  return hotGames;
};
