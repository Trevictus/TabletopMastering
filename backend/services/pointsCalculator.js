/**
 * Servicio para calcular puntos en partidas
 * Define la lógica de puntos sin efectos secundarios
 */

const POSITION_POINTS = {
  1: 10,
  2: 5,
  3: 2,
  4: 1,
};

const PARTICIPATION_POINTS = 1;

/**
 * Calcula puntos basado en la posición final
 * @param {number} position - Posición del jugador (1, 2, 3, etc)
 * @returns {number} Puntos ganados
 */
const calculatePointsByPosition = (position) => {
  if (!position || position < 1) return PARTICIPATION_POINTS;
  return POSITION_POINTS[position] || PARTICIPATION_POINTS;
};

/**
 * Calcula puntos para todos los jugadores de una partida
 * @param {Array} players - Array de jugadores con posición
 * @returns {Array} Array con {userId, points}
 */
const calculatePointsForAllPlayers = (players) => {
  return players.map(player => ({
    userId: player.user,
    points: calculatePointsByPosition(player.position),
  }));
};

/**
 * Valida que no haya posiciones duplicadas (excepto null)
 * @param {Array} players - Array de jugadores
 * @returns {boolean} True si es válido
 */
const validatePositions = (players) => {
  const positions = players
    .filter(p => p.position !== null && p.position !== undefined)
    .map(p => p.position);
  
  const uniquePositions = new Set(positions);
  return positions.length === uniquePositions.size;
};

module.exports = {
  calculatePointsByPosition,
  calculatePointsForAllPlayers,
  validatePositions,
  POSITION_POINTS,
  PARTICIPATION_POINTS,
};
