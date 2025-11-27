const User = require('../models/User');
const pointsCalculator = require('./pointsCalculator');

/**
 * Servicio para manejar ranking y estadísticas de usuarios
 * Optimizado con lean(), projections y consultas eficientes
 */

/**
 * Proyección para datos de ranking
 */
const RANKING_USER_PROJECTION = {
  name: 1,
  avatar: 1,
  stats: 1,
};

/**
 * Actualiza los puntos de un usuario (usando findByIdAndUpdate atómico)
 * @param {string} userId - ID del usuario
 * @param {number} pointsEarned - Puntos ganados
 * @param {boolean} isWinner - Si fue ganador
 * @returns {object} Usuario actualizado
 */
const updateUserPoints = async (userId, pointsEarned, isWinner = false) => {
  const updateOps = {
    $inc: {
      'stats.totalPoints': pointsEarned,
      'stats.totalMatches': 1,
    }
  };
  
  if (isWinner) {
    updateOps.$inc['stats.totalWins'] = 1;
  }
  
  const user = await User.findByIdAndUpdate(
    userId,
    updateOps,
    { new: true, select: 'stats' }
  ).lean();
  
  if (!user) {
    throw new Error(`Usuario ${userId} no encontrado`);
  }

  return user;
};

/**
 * Actualiza estadísticas de todos los jugadores en una partida
 * @param {object} match - Documento de Match con jugadores y ganador
 * @returns {object} Reporte de actualización
 */
const updateMatchStatistics = async (match) => {
  const report = {
    success: true,
    updatedPlayers: [],
    errors: [],
  };

  // Calcular puntos para cada jugador
  const pointsData = pointsCalculator.calculatePointsForAllPlayers(match.players);

  // Actualizar cada jugador
  for (const data of pointsData) {
    try {
      const isWinner = match.winner && match.winner.toString() === data.userId.toString();
      const updatedUser = await updateUserPoints(data.userId, data.points, isWinner);
      
      report.updatedPlayers.push({
        userId: data.userId,
        points: data.points,
        isWinner,
        stats: updatedUser.stats,
      });
    } catch (error) {
      report.errors.push({
        userId: data.userId,
        error: error.message,
      });
    }
  }

  return report;
};

/**
 * Obtiene el ranking de un grupo (optimizado con lean y projection)
 * @param {string} groupId - ID del grupo
 * @returns {Array} Array de usuarios ordenados por puntos
 */
const getGroupRanking = async (groupId) => {
  const users = await User.find({
    groups: groupId,
  })
    .select(RANKING_USER_PROJECTION)
    .sort({ 'stats.totalPoints': -1 })
    .lean();

  return users.map((user, index) => ({
    position: index + 1,
    userId: user._id,
    name: user.name,
    avatar: user.avatar,
    totalPoints: user.stats.totalPoints,
    totalMatches: user.stats.totalMatches,
    totalWins: user.stats.totalWins,
    winRate: user.stats.totalMatches > 0 
      ? ((user.stats.totalWins / user.stats.totalMatches) * 100).toFixed(2) 
      : 0,
  }));
};

/**
 * Obtiene el ranking global de todos los usuarios (optimizado con lean y projection)
 * @returns {Array} Array de usuarios ordenados por puntos
 */
const getGlobalRanking = async () => {
  const users = await User.find({ isActive: true })
    .select(RANKING_USER_PROJECTION)
    .sort({ 'stats.totalPoints': -1 })
    .lean();

  return users.map((user, index) => ({
    position: index + 1,
    userId: user._id,
    name: user.name,
    avatar: user.avatar,
    totalPoints: user.stats.totalPoints,
    totalMatches: user.stats.totalMatches,
    totalWins: user.stats.totalWins,
    winRate: user.stats.totalMatches > 0 
      ? ((user.stats.totalWins / user.stats.totalMatches) * 100).toFixed(2) 
      : 0,
  }));
};

module.exports = {
  updateUserPoints,
  updateMatchStatistics,
  getGroupRanking,
  getGlobalRanking,
};
