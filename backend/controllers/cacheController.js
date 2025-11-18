const bggService = require('../services/bggService');

/**
 * @desc    Obtener estadísticas de la caché de BGG
 * @route   GET /api/games/cache/stats
 * @access  Private (Admin only - implementar middleware si es necesario)
 */
exports.getCacheStats = async (req, res, next) => {
  try {
    const stats = await bggService.getCacheStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Invalidar caché de un juego específico
 * @route   DELETE /api/games/cache/:bggId
 * @access  Private (Admin only - implementar middleware si es necesario)
 */
exports.invalidateCache = async (req, res, next) => {
  try {
    const { bggId } = req.params;

    if (!bggId || isNaN(bggId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de BGG inválido',
      });
    }

    await bggService.invalidateCache(parseInt(bggId));

    res.status(200).json({
      success: true,
      message: `Caché invalidada para el juego con bggId: ${bggId}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Limpiar toda la caché de BGG
 * @route   DELETE /api/games/cache
 * @access  Private (Admin only - implementar middleware si es necesario)
 */
exports.clearCache = async (req, res, next) => {
  try {
    await bggService.clearCache();

    res.status(200).json({
      success: true,
      message: 'Toda la caché de BGG ha sido limpiada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
