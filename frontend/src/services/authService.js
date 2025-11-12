import api from './api';

const authService = {
  // Registro de usuario
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.data && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Inicio de sesión
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener perfil del usuario actual
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Verificar si hay un usuario autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario del localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
