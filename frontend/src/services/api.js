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

// Configuración base de la API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
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
 */
const pendingRequests = new Map();

/**
 * Genera una key única para cada petición
 */
const generateRequestKey = (config) => {
  const { method, url, params, data } = config;
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
};

/**
 * Remueve una petición del mapa de pendientes
 */
const removePendingRequest = (config) => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const cancelToken = pendingRequests.get(requestKey);
    cancelToken.cancel('Petición duplicada cancelada');
    pendingRequests.delete(requestKey);
  }
};

/**
 * Añade una petición al mapa de pendientes
 */
const addPendingRequest = (config) => {
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
    // 1. Añadir token de autenticación si existe
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
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

    // 4. Logging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ [API Request Error]', error);
    }
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

    // 2. Calcular tiempo de respuesta
    if (response.config.metadata?.startTime) {
      const duration = new Date() - response.config.metadata.startTime;
      response.duration = duration;
      
      if (import.meta.env.DEV) {
        console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          duration: `${duration}ms`,
          data: response.data,
        });
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1. Petición cancelada (duplicada)
    if (axios.isCancel(error)) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ [API] Petición cancelada (duplicada)');
      }
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
        
        if (import.meta.env.DEV) {
          console.log(`🔄 [API] Reintentando petición (${originalRequest._retryCount}/2)...`);
        }

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

        // Limpiar datos de autenticación
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        if (import.meta.env.DEV) {
          console.warn('⚠️ [API] Token expirado - Redirigiendo a login');
        }

        // Redirigir a login
        if (currentPath !== AUTH_ROUTES.HOME) {
          window.location.href = AUTH_ROUTES.LOGIN;
        }
      }
    }

    // 5. Error 403 - Prohibido
    if (error.response?.status === 403) {
      if (import.meta.env.DEV) {
        console.error('🚫 [API] Acceso prohibido');
      }
    }

    // 6. Error 404 - No encontrado
    if (error.response?.status === 404) {
      if (import.meta.env.DEV) {
        console.error('🔍 [API] Recurso no encontrado');
      }
    }

    // 7. Error 500 - Error del servidor
    if (error.response?.status >= 500) {
      if (import.meta.env.DEV) {
        console.error('💥 [API] Error del servidor', error.response.data);
      }
    }

    // 8. Logging detallado en desarrollo
    if (import.meta.env.DEV) {
      console.error('❌ [API Error]', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }

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
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Limpia la autenticación
 */
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  delete api.defaults.headers.common['Authorization'];
  cancelAllPendingRequests();
};

/**
 * Obtiene el token actual
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
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
