import api from './api';
import { STORAGE_KEYS } from '../constants/auth';

/**
 * Servicio de autenticación
 * Gestiona todas las operaciones relacionadas con autenticación y persistencia de usuario
 * 
 * IMPORTANTE: Usamos sessionStorage en lugar de localStorage para aislar sesiones por pestaña.
 * Esto permite que diferentes usuarios inicien sesión en diferentes pestañas del mismo navegador.
 */
const authService = {
  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario (name, email, password)
   * @returns {Promise<Object>} Datos del usuario y token
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.data?.token && response.data.data?.user) {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Inicia sesión
   * @param {Object} credentials - Email y contraseña
   * @returns {Promise<Object>} Datos del usuario y token
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data?.token && response.data.data?.user) {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Cierra sesión
   * Limpia token y datos de usuario del sessionStorage
   */
  logout: () => {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.SELECTED_GROUP);
  },

  /**
   * Obtiene el perfil del usuario autenticado desde el backend
   * Valida que el token sea válido
   * @returns {Promise<Object>} Datos del usuario actualizado
   */
  getProfile: async () => {
    const response = await api.get('/auth/me');
    // Backend devuelve { success, data: user }
    const user = response.data.data || response.data.user;
    if (user) {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    return { user };
  },

  /**
   * Actualiza el perfil del usuario
   * @param {Object} profileData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    // Backend devuelve { success, message, data: { user } }
    if (response.data.data?.user) {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
      return response.data.data; // Devolver { user }
    }
    return response.data;
  },

  /**
   * Sincroniza los datos del usuario en sessionStorage
   * @param {Object} userData - Datos actualizados del usuario
   */
  syncUserData: (userData) => {
    if (userData) {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    }
  },

  /**
   * Verifica si existe un token de autenticación
   * @returns {boolean} True si hay token
   */
  isAuthenticated: () => {
    const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  },

  /**
   * Obtiene el usuario del sessionStorage
   * NOTA: Estos datos pueden estar desactualizados, usar getProfile() para datos frescos
   * @returns {Object|null} Usuario o null
   */
  getCurrentUser: () => {
    try {
      const user = sessionStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al parsear usuario de sessionStorage:', error);
      return null;
    }
  },

  /**
   * Obtiene el token actual
   * @returns {string|null} Token de autenticación
   */
  getToken: () => {
    return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Verifica disponibilidad de nickname
   * @param {string} nickname - Nickname a verificar
   * @param {string} userId - ID del usuario actual (para excluirlo al editar perfil)
   * @returns {Promise<Object>} { available, message, suggestions? }
   */
  checkNickname: async (nickname, userId = null) => {
    try {
      const response = await api.post('/auth/check-nickname', { nickname, userId });
      return response.data;
    } catch (error) {
      return {
        available: false,
        message: error.response?.data?.message || 'Error al verificar',
      };
    }
  },

  /**
   * Verifica disponibilidad de email
   * @param {string} email - Email a verificar
   * @param {string} userId - ID del usuario actual (para excluirlo al editar perfil)
   * @returns {Promise<Object>} { available, message }
   */
  checkEmail: async (email, userId = null) => {
    try {
      const response = await api.post('/auth/check-email', { email, userId });
      return response.data;
    } catch (error) {
      return {
        available: false,
        message: error.response?.data?.message || 'Error al verificar',
      };
    }
  },

  /**
   * Exportar todos los datos del usuario (RGPD)
   * @returns {Promise<Object>} Datos exportados del usuario
   */
  exportUserData: async () => {
    const response = await api.get('/auth/export-data');
    return response.data;
  },

  /**
   * Eliminar cuenta y todos los datos (RGPD)
   * @param {string} password - Contraseña para confirmar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  deleteAccount: async (password) => {
    const response = await api.delete('/auth/delete-account', { data: { password } });
    return response.data;
  },
};

export default authService;
