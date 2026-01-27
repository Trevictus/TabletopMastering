/**
 * @fileoverview Cliente API HTTP
 * @description Configuración de Axios con interceptors, autenticación y manejo de errores
 * @module services/api
 */

import axios from 'axios';
import { STORAGE_KEYS, AUTH_ROUTES } from '../constants/auth';

/**
 * Configuración del cliente API con Axios
 * 
 * Características:
 * - Interceptors para autenticación automática
 * - Manejo centralizado de errores
 * - Retry automático en fallos de red
 * - Logging en desarrollo
 * - Cancelación de peticiones duplicadas
 */

// Detectar la URL base de la API dinámicamente
const getApiBaseURL = () => {
  // Si hay una variable de entorno configurada, usarla
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Por defecto, usar localhost (desarrollo local con Docker)
  return 'http://localhost/api';
};

// Configuración base de la API
const API_CONFIG = {
  baseURL: getApiBaseURL(),
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};


/**
 * Instancia principal de Axios
 */
const api = axios.create(API_CONFIG);

/**
 * Map para almacenar peticiones en progreso y evitar duplicados
 * Deshabilitado por defecto para evitar problemas con React StrictMode
 */
const pendingRequests = new Map();

/**
 * Flag para habilitar/deshabilitar la cancelación de peticiones duplicadas
 * Deshabilitado por defecto porque puede causar problemas con React 18 StrictMode
 */
const ENABLE_DUPLICATE_REQUEST_CANCELLATION = false;

/**
 * Genera una key única para cada petición
 */
const generateRequestKey = (config) => {
  const { method, url, params, data } = config;
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
};

/**
 * Remueve una petición del mapa de pendientes (sin cancelarla)
 */
const removePendingRequest = (config) => {
  if (!ENABLE_DUPLICATE_REQUEST_CANCELLATION) return;
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    pendingRequests.delete(requestKey);
  }
};

/**
 * Añade una petición al mapa de pendientes
 */
const addPendingRequest = (config) => {
  if (!ENABLE_DUPLICATE_REQUEST_CANCELLATION) return;
  const requestKey = generateRequestKey(config);
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingRequests.has(requestKey)) {
      pendingRequests.set(requestKey, { cancel });
    }
  });
};

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * Interceptor de peticiones salientes
 * 
 * Responsabilidades:
 * - Añadir token de autenticación
 * - Prevenir peticiones duplicadas
 * - Logging en desarrollo
 * - Añadir timestamps para métricas
 */
api.interceptors.request.use(
  (config) => {
    // 1. Añadir token de autenticación si existe (sessionStorage para aislamiento por pestaña)
    const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Prevenir peticiones duplicadas (opcional, solo para GET)
    if (config.method === 'get') {
      removePendingRequest(config);
      addPendingRequest(config);
    }

    // 3. Añadir timestamp para métricas
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

/**
 * Interceptor de respuestas entrantes
 * 
 * Responsabilidades:
 * - Logging de respuestas
 * - Manejo de errores de autenticación (401)
 * - Manejo de errores de servidor (500)
 * - Retry automático en fallos de red
 * - Métricas de rendimiento
 */
api.interceptors.response.use(
  (response) => {
    // 1. Remover de peticiones pendientes
    removePendingRequest(response.config);

    // 2. Calcular tiempo de respuesta para métricas
    if (response.config.metadata?.startTime) {
      const duration = new Date() - response.config.metadata.startTime;
      response.duration = duration;
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1. Petición cancelada (duplicada) - Silenciar completamente
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // 2. Remover de peticiones pendientes
    if (originalRequest) {
      removePendingRequest(originalRequest);
    }

    // 3. Error de red - Retry automático (hasta 3 intentos)
    if (!error.response && originalRequest && !originalRequest._retry) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      
      if (originalRequest._retryCount < 2) {
        originalRequest._retryCount += 1;

        // Esperar antes de reintentar (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * originalRequest._retryCount)
        );

        return api(originalRequest);
      }
    }

    // 4. Error 401 - Token inválido o expirado
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthRoute = currentPath === AUTH_ROUTES.LOGIN || 
                         currentPath === AUTH_ROUTES.REGISTER;

      if (!isAuthRoute && !originalRequest._retry) {
        originalRequest._retry = true;

        // Limpiar datos de autenticación (sessionStorage para aislamiento por pestaña)
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);

        // Redirigir a login
        if (currentPath !== AUTH_ROUTES.HOME) {
          window.location.href = AUTH_ROUTES.LOGIN;
        }
      }
    }

    // 5. Error 403 - Prohibido (silencioso)
    // 6. Error 404 - No encontrado (silencioso)
    // 7. Error 500+ - Error del servidor (silencioso)

    // Retornar error para manejo en componentes
    return Promise.reject(error);
  }
);

// ============================================================================
// UTILIDADES ADICIONALES
// ============================================================================

/**
 * Cancela todas las peticiones pendientes
 * Útil al navegar entre páginas o desmontar componentes
 */
export const cancelAllPendingRequests = () => {
  pendingRequests.forEach((request) => {
    request.cancel('Navegación - Peticiones canceladas');
  });
  pendingRequests.clear();
};

/**
 * Configura un nuevo token de autenticación
 * @param {string} token - Token JWT
 */
export const setAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Limpia la autenticación
 */
export const clearAuth = () => {
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.SELECTED_GROUP);
  delete api.defaults.headers.common['Authorization'];
  cancelAllPendingRequests();
};

/**
 * Obtiene el token actual
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Verifica si hay una sesión activa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Exportar instancia principal
export default api;
