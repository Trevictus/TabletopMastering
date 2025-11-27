const matchService = require('../services/matchService');

/**
 * @desc    Crear una partida
 * @route   POST /api/matches
 * @access  Private
 */
exports.createMatch = async (req, res, next) => {
  try {
    const { gameId, groupId, scheduledDate, location, playerIds, notes } = req.body;

    const match = await matchService.createMatch(
      gameId,
      groupId,
      scheduledDate,
      req.user._id,
      playerIds,
      location,
      notes
    );

    res.status(201).json({
      success: true,
      message: 'Partida creada exitosamente',
      data: match,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    // Manejar errores de validación de Mongoose u otros errores
    if (error.message) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Listar partidas (con filtros)
 * @route   GET /api/matches
 * @access  Private
 */
exports.getMatches = async (req, res, next) => {
  try {
    const { groupId, status, page = 1, limit = 20 } = req.query;

    const result = await matchService.getMatches(
      groupId || null,
      req.user._id,
      status,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      count: result.count,
      total: result.total,
      pages: result.pages,
      currentPage: result.currentPage,
      data: result.matches,
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
 * @desc    Obtener una partida por ID
 * @route   GET /api/matches/:id
 * @access  Private
 */
exports.getMatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await matchService.getMatchById(id, req.user._id);

    res.status(200).json({
      success: true,
      data: match,
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
 * @desc    Actualizar partida
 * @route   PUT /api/matches/:id
 * @access  Private
 */
exports.updateMatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await matchService.updateMatch(id, req.body, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Partida actualizada exitosamente',
      data: match,
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
 * @desc    Registrar resultados de partida
 * @route   POST /api/matches/:id/finish
 * @access  Private
 */
exports.finishMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { winnerId, results, duration, notes } = req.body;

    const { match, rankingReport } = await matchService.finishMatch(
      id,
      req.user._id,
      winnerId,
      results,
      duration,
      notes
    );

    res.status(200).json({
      success: true,
      message: 'Partida finalizada y resultados registrados',
      data: match,
      ranking: rankingReport,
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
 * @desc    Confirmar asistencia a partida
 * @route   POST /api/matches/:id/confirm
 * @access  Private
 */
exports.confirmAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await matchService.confirmAttendance(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Asistencia confirmada',
      data: match,
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
 * @desc    Eliminar partida
 * @route   DELETE /api/matches/:id
 * @access  Private
 */
exports.deleteMatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    await matchService.deleteMatch(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Partida eliminada exitosamente',
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
 * @desc    Obtener ranking global de usuarios
 * @route   GET /api/matches/ranking/global
 * @access  Private
 */
exports.getGlobalRanking = async (req, res, next) => {
  try {
    const ranking = await matchService.getGlobalRanking();

    res.status(200).json({
      success: true,
      data: ranking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener ranking de un grupo
 * @route   GET /api/matches/ranking/group/:groupId
 * @access  Private
 */
exports.getGroupRanking = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const ranking = await matchService.getGroupRanking(groupId, req.user._id);

    res.status(200).json({
      success: true,
      data: ranking,
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
