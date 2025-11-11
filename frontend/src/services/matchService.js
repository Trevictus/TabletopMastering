import api from './api';

const matchService = {
  // Obtener partidas (cuando se implemente el backend)
  getMatches: async (params = {}) => {
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
};

export default matchService;
