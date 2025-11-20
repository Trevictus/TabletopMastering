const gameService = require('../services/gameService');
const bggGameService = require('../services/bggGameService');

/**
 * @desc    Buscar juegos en BoardGameGeek (sin guardar)
 * @route   GET /api/games/search-bgg
 * @access  Private
 */
exports.searchBGG = async (req, res, next) => {
  try {
    const { name, exact } = req.query;

    const results = await bggGameService.searchBGGGames(name, exact === 'true');

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener detalles de un juego de BGG por ID
 * @route   GET /api/games/bgg/:bggId
 * @access  Private
 */
exports.getBGGDetails = async (req, res, next) => {
  try {
    const { bggId } = req.params;

    const gameDetails = await bggGameService.getBGGGameDetails(bggId);

    res.status(200).json({
      success: true,
      data: gameDetails,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Añadir un juego de BGG
 * @route   POST /api/games/add-from-bgg
 * @access  Private
 */
exports.addFromBGG = async (req, res, next) => {
  try {
    const { bggId, groupId, customNotes } = req.body;

    const savedGame = await bggGameService.addBGGGame(
      bggId,
      req.user._id,
      groupId,
      customNotes
    );

    res.status(201).json({
      success: true,
      message: 'Juego añadido desde BGG exitosamente',
      data: savedGame,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        ...(error.data && { data: error.data }),
      });
    }
    next(error);
  }
};

/**
 * @desc    Crear un juego personalizado
 * @route   POST /api/games
 * @access  Private
 */
exports.createGame = async (req, res, next) => {
  try {
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
      groupId,
      yearPublished,
      customNotes,
    } = req.body;

    const savedGame = await gameService.createCustomGame(
      {
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
      },
      req.user._id,
      groupId
    );

    res.status(201).json({
      success: true,
      message: 'Juego personalizado creado exitosamente',
      data: savedGame,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        ...(error.data && { data: error.data }),
      });
    }
    next(error);
  }
};

/**
 * @desc    Listar juegos (personales o por grupo sin duplicados)
 * @route   GET /api/games
 * @access  Private
 */
exports.getGames = async (req, res, next) => {
  try {
    const { groupId, source, search, page = 1, limit = 20 } = req.query;

    // Si hay groupId, verificar acceso
    if (groupId) {
      await bggGameService.validateGroupAccess(groupId, req.user._id);
    }

    const result = await gameService.getGames(
      req.user._id,
      groupId || null,
      { source, search, page, limit }
    );

    res.status(200).json({
      success: true,
      count: result.count,
      total: result.total,
      pages: result.pages,
      currentPage: result.currentPage,
      data: result.games,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Obtener un juego por ID
 * @route   GET /api/games/:id
 * @access  Private
 */
exports.getGame = async (req, res, next) => {
  try {
    const game = await gameService.getGameById(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Actualizar un juego
 * @route   PUT /api/games/:id
 * @access  Private
 */
exports.updateGame = async (req, res, next) => {
  try {
    const updatedGame = await gameService.updateGame(
      req.params.id,
      req.body,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Juego actualizado exitosamente',
      data: updatedGame,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Sincronizar juego de BGG (actualizar datos)
 * @route   PUT /api/games/:id/sync-bgg
 * @access  Private
 */
exports.syncBGGGame = async (req, res, next) => {
  try {
    const updatedGame = await bggGameService.syncBGGGame(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Juego sincronizado con BGG exitosamente',
      data: updatedGame,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Eliminar un juego (soft delete)
 * @route   DELETE /api/games/:id
 * @access  Private
 */
exports.deleteGame = async (req, res, next) => {
  try {
    await gameService.deleteGame(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Juego eliminado exitosamente',
      data: {},
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Obtener juegos populares de BGG
 * @route   GET /api/games/bgg/hot
 * @access  Private
 */
exports.getHotGames = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const hotGames = await bggGameService.getHotGames(limit);

    res.status(200).json({
      success: true,
      count: hotGames.length,
      data: hotGames,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener estadísticas de juegos de un grupo
 * @route   GET /api/games/stats/:groupId
 * @access  Private
 */
exports.getGroupGameStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Verificar acceso al grupo
    await bggGameService.validateGroupAccess(groupId, req.user._id);

    const stats = await gameService.getGroupStats(groupId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};
