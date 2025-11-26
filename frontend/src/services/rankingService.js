import api from './api';

const rankingService = {
  // Obtener ranking de un grupo
  getGroupRanking: async (groupId, params = {}) => {
    const response = await api.get(`/groups/${groupId}/ranking`, { params });
    return response.data;
  },

  // Obtener ranking personal del usuario
  getPersonalRanking: async (params = {}) => {
    const response = await api.get('/ranking/personal', { params });
    return response.data;
  },
};

export default rankingService;
