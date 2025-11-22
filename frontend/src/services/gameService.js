import api from './api';

const gameService = {
  // Buscar juegos en BoardGameGeek
  searchBGG: async (query) => {
    const response = await api.get('/games/search-bgg', {
      params: { query },
    });
    return response.data;
  },

  // Obtener detalles de un juego de BGG
  getBGGDetails: async (bggId) => {
    const response = await api.get(`/games/bgg/${bggId}`);
    return response.data;
  },

  // Obtener lista de juegos populares de BGG
  getBGGHotList: async () => {
    const response = await api.get('/games/bgg/hot');
    return response.data;
  },

  // Añadir juego desde BGG
  addFromBGG: async (bggId, groupId, notes) => {
    const response = await api.post('/games/add-from-bgg', {
      bggId,
      groupId,
      notes,
    });
    return response.data;
  },

  // Crear juego personalizado
  createCustomGame: async (gameData) => {
    const response = await api.post('/games', gameData);
    return response.data;
  },

  // Obtener lista de juegos con filtros
  getGames: async (params = {}) => {
    const response = await api.get('/games', { params });
    return response.data;
  },

  // Obtener detalles de un juego
  getGameById: async (gameId) => {
    const response = await api.get(`/games/${gameId}`);
    return response.data;
  },

  // Actualizar juego
  updateGame: async (gameId, gameData) => {
    const response = await api.put(`/games/${gameId}`, gameData);
    return response.data;
  },

  // Sincronizar juego con BGG
  syncWithBGG: async (gameId) => {
    const response = await api.put(`/games/${gameId}/sync-bgg`);
    return response.data;
  },

  // Eliminar juego
  deleteGame: async (gameId) => {
    const response = await api.delete(`/games/${gameId}`);
    return response.data;
  },

  // Obtener estadísticas de juegos del grupo
  getGroupStats: async (groupId) => {
    const response = await api.get(`/games/stats/${groupId}`);
    return response.data;
  },

  // Subir imagen para un juego
  uploadGameImage: async (gameId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post(`/games/${gameId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default gameService;
