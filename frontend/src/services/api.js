import axios from 'axios';
import { STORAGE_KEYS, AUTH_ROUTES } from '../constants/auth';

/**
 * Instancia configurada de axios para comunicación con el backend
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de peticiones
 * Añade automáticamente el token de autenticación a todas las peticiones
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas
 * Maneja errores globales y tokens expirados
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      // Limpiar localStorage solo si no estamos en las rutas de auth
      const currentPath = window.location.pathname;
      const isAuthRoute = currentPath === AUTH_ROUTES.LOGIN || currentPath === AUTH_ROUTES.REGISTER;

      // No redirigir si ya estamos en login/register o si es la validación inicial
      if (!isAuthRoute) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        // Redirigir solo si no estamos ya en una ruta pública
        if (currentPath !== AUTH_ROUTES.HOME) {
          window.location.href = AUTH_ROUTES.LOGIN;
        }
      }
    }

    // Retornar error para que pueda ser manejado por el componente
    return Promise.reject(error);
  }
);

export default api;
