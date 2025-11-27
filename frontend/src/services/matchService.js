import api from './api';

const matchService = {
  // Obtener partidas (cuando se implemente el backend)
  getMatches: async (params = {}) => {
    const response = await api.get('/matches', { params });
    return response.data;
  },

  // Obtener todas las partidas del usuario de todos sus grupos
  getAllUserMatches: async (params = {}) => {
    const response = await api.get('/matches', { params });
    return response.data;
  },

  // Crear nueva partida
  createMatch: async (matchData) => {
    const response = await api.post('/matches', matchData);
    return response.data;
  },

  // Obtener detalles de una partida
  getMatchById: async (matchId) => {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  // Actualizar partida
  updateMatch: async (matchId, matchData) => {
    const response = await api.put(`/matches/${matchId}`, matchData);
    return response.data;
  },

  // Eliminar partida
  deleteMatch: async (matchId) => {
    const response = await api.delete(`/matches/${matchId}`);
    return response.data;
  },

  // Confirmar asistencia a una partida
  confirmAttendance: async (matchId) => {
    const response = await api.post(`/matches/${matchId}/confirm`);
    return response.data;
  },

  // Cancelar asistencia (actualizar confirmed a false)
  cancelAttendance: async (matchId) => {
    const response = await api.delete(`/matches/${matchId}/confirm`);
    return response.data;
  },

  /**
   * Finalizar partida y registrar resultados
   * @param {string} matchId - ID de la partida
   * @param {object} resultData - Datos de resultados
   * @param {string} resultData.winnerId - ID del ganador (opcional)
   * @param {Array} resultData.results - Array de { userId, score, position }
   * @param {object} resultData.duration - { value: number, unit: 'minutos'|'horas' }
   * @param {string} resultData.notes - Notas adicionales (opcional)
   * @returns {object} { data: match, ranking: rankingReport }
   */
  finishMatch: async (matchId, resultData) => {
    const response = await api.post(`/matches/${matchId}/finish`, resultData);
    return response.data;
  },
};

export default matchService;
