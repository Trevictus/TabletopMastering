import api from './api';
import { STORAGE_KEYS } from '../constants/auth';

/**
 * Servicio de autenticación
 * Gestiona todas las operaciones relacionadas con autenticación y persistencia de usuario
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
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
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
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Cierra sesión
   * Limpia token y datos de usuario del localStorage
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Obtiene el perfil del usuario autenticado desde el backend
   * Valida que el token sea válido
   * @returns {Promise<Object>} Datos del usuario actualizado
   */
  getProfile: async () => {
    const response = await api.get('/auth/me');
    // Actualizar datos en localStorage con la información más reciente
    if (response.data.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response.data;
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
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
      return response.data.data; // Devolver { user }
    }
    return response.data;
  },

  /**
   * Sincroniza los datos del usuario en localStorage
   * @param {Object} userData - Datos actualizados del usuario
   */
  syncUserData: (userData) => {
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    }
  },

  /**
   * Verifica si existe un token de autenticación
   * @returns {boolean} True si hay token
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  },

  /**
   * Obtiene el usuario del localStorage
   * NOTA: Estos datos pueden estar desactualizados, usar getProfile() para datos frescos
   * @returns {Object|null} Usuario o null
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al parsear usuario de localStorage:', error);
      return null;
    }
  },

  /**
   * Obtiene el token actual
   * @returns {string|null} Token de autenticación
   */
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};

export default authService;
