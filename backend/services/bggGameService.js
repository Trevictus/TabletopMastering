const Game = require('../models/Game');
const Group = require('../models/Group');
const bggService = require('./bggService');

/**
 * Validar y obtener acceso al grupo para operaciones BGG
 */
exports.validateGroupAccess = async (groupId, userId) => {
  if (!groupId) {
    return null;
  }

  const group = await Group.findById(groupId);
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
 * Buscar juegos en BoardGameGeek (sin guardar)
 */
exports.searchBGGGames = async (name, exact = false) => {
  if (!name) {
    throw new Error('El parámetro "name" es obligatorio');
  }

  const results = await bggService.searchGames(name, exact);

  return results;
};

/**
 * Obtener detalles de un juego de BGG por ID
 */
exports.getBGGGameDetails = async (bggId) => {
  if (!bggId || isNaN(bggId)) {
    throw new Error('ID de BGG inválido');
  }

  const gameDetails = await bggService.getGameDetails(parseInt(bggId));

  return gameDetails;
};

/**
 * Añadir un juego de BGG
 */
exports.addBGGGame = async (bggId, userId, groupId = null, customNotes = '') => {
  // Validaciones
  if (!bggId) {
    throw new Error('El ID de BGG es obligatorio');
  }

  // Verificar que el grupo existe y el usuario es miembro o admin (si se proporciona)
  if (groupId) {
    const group = await Group.findById(groupId);
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

    // Verificar si el juego ya existe en el grupo
    const existingGame = await Game.findOne({ 
      bggId: bggId, 
      group: groupId,
      isActive: true 
    });

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
    });

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
 * Sincronizar juego de BGG (actualizar datos)
 */
exports.syncBGGGame = async (gameId, userId) => {
  const game = await Game.findOne({ _id: gameId, isActive: true });

  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  if (game.source !== 'bgg') {
    throw new Error('Este endpoint solo funciona con juegos de BGG');
  }

  // Verificar permisos
  if (game.group) {
    const group = await Group.findById(game.group);
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

  // Actualizar el juego directamente para evitar problemas de validación cruzada
  game.name = bggData.name;
  game.description = bggData.description;
  game.image = bggData.image;
  game.thumbnail = bggData.thumbnail;
  game.yearPublished = bggData.yearPublished;
  game.minPlayers = bggData.minPlayers;
  game.maxPlayers = bggData.maxPlayers;
  game.playingTime = bggData.playingTime;
  game.minPlayTime = bggData.minPlayTime;
  game.maxPlayTime = bggData.maxPlayTime;
  game.categories = bggData.categories;
  game.mechanics = bggData.mechanics;
  game.designer = bggData.designer;
  game.publisher = bggData.publisher;
  game.rating = bggData.rating;
  game.bggLastSync = new Date();

  // Guardar y popular
  const updatedGame = await game.save();
  await updatedGame.populate('addedBy', 'name email');
  await updatedGame.populate('group', 'name');

  // Verificar que la sincronización fue exitosa
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
