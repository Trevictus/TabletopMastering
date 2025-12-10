/**
 * @fileoverview Manejador de Errores de API
 * @description Utilidades para categorización y formateo de errores HTTP
 * @module services/apiErrorHandler
 */

/**
 * Utilidades para manejo centralizado de errores de API
 * 
 * Proporciona funciones helper para:
 * - Extraer mensajes de error consistentes
 * - Categorizar tipos de errores
 * - Formatear errores para UI
 */

/**
 * Tipos de errores clasificados
 */
export const ErrorTypes = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  TIMEOUT: 'timeout',
  CANCELLED: 'cancelled',
  UNKNOWN: 'unknown',
};

/**
 * Mensajes de error por defecto en español
 */
const DEFAULT_ERROR_MESSAGES = {
  [ErrorTypes.NETWORK]: 'Error de conexión. Verifica tu conexión a internet.',
  [ErrorTypes.AUTHENTICATION]: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  [ErrorTypes.AUTHORIZATION]: 'No tienes permisos para realizar esta acción.',
  [ErrorTypes.VALIDATION]: 'Los datos proporcionados no son válidos.',
  [ErrorTypes.NOT_FOUND]: 'El recurso solicitado no fue encontrado.',
  [ErrorTypes.SERVER]: 'Error en el servidor. Inténtalo de nuevo más tarde.',
  [ErrorTypes.TIMEOUT]: 'La petición tardó demasiado tiempo. Inténtalo de nuevo.',
  [ErrorTypes.CANCELLED]: 'La petición fue cancelada.',
  [ErrorTypes.UNKNOWN]: 'Ocurrió un error inesperado.',
};

/**
 * Determina el tipo de error basado en el objeto de error
 * 
 * @param {Object} error - Error de Axios
 * @returns {string} Tipo de error
 */
export const getErrorType = (error) => {
  // Error de red (sin respuesta)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return ErrorTypes.TIMEOUT;
    }
    if (error.message === 'Network Error') {
      return ErrorTypes.NETWORK;
    }
    if (error.message?.includes('cancelada') || error.message?.includes('canceled')) {
      return ErrorTypes.CANCELLED;
    }
    return ErrorTypes.NETWORK;
  }

  // Errores con respuesta del servidor
  const status = error.response.status;

  switch (status) {
    case 401:
      return ErrorTypes.AUTHENTICATION;
    case 403:
      return ErrorTypes.AUTHORIZATION;
    case 404:
      return ErrorTypes.NOT_FOUND;
    case 422:
    case 400:
      return ErrorTypes.VALIDATION;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorTypes.SERVER;
    default:
      return ErrorTypes.UNKNOWN;
  }
};

/**
 * Extrae el mensaje de error del objeto de error
 * 
 * @param {Object} error - Error de Axios
 * @returns {string} Mensaje de error legible
 */
export const getErrorMessage = (error) => {
  const errorType = getErrorType(error);

  // Si hay un mensaje específico del servidor, usarlo
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Si hay errores de validación detallados
  if (error.response?.data?.errors) {
    const validationErrors = error.response.data.errors;
    
    // Si es un objeto de errores
    if (typeof validationErrors === 'object' && !Array.isArray(validationErrors)) {
      const firstError = Object.values(validationErrors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
    
    // Si es un array de errores
    if (Array.isArray(validationErrors)) {
      return validationErrors[0]?.msg || validationErrors[0];
    }
  }

  // Mensaje por defecto según el tipo
  return DEFAULT_ERROR_MESSAGES[errorType];
};

/**
 * Extrae todos los errores de validación
 * 
 * @param {Object} error - Error de Axios
 * @returns {Object} Objeto con campos y sus errores
 */
export const getValidationErrors = (error) => {
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    
    // Si ya es un objeto campo -> error, retornarlo
    if (typeof errors === 'object' && !Array.isArray(errors)) {
      return errors;
    }
    
    // Si es un array de errores, convertir a objeto
    if (Array.isArray(errors)) {
      return errors.reduce((acc, err) => {
        if (err.param) {
          acc[err.param] = err.msg;
        }
        return acc;
      }, {});
    }
  }
  
  return {};
};

/**
 * Crea un objeto de error formateado para la UI
 * 
 * @param {Object} error - Error de Axios
 * @returns {Object} Error formateado
 */
export const formatError = (error) => {
  return {
    type: getErrorType(error),
    message: getErrorMessage(error),
    validationErrors: getValidationErrors(error),
    status: error.response?.status,
    statusText: error.response?.statusText,
    originalError: import.meta.env.DEV ? error : undefined,
  };
};

/**
 * Verifica si un error es de un tipo específico
 * 
 * @param {Object} error - Error de Axios
 * @param {string} type - Tipo de error a verificar
 * @returns {boolean}
 */
export const isErrorType = (error, type) => {
  return getErrorType(error) === type;
};

/**
 * Verifica si el error es recuperable (puede reintentar)
 * 
 * @param {Object} error - Error de Axios
 * @returns {boolean}
 */
export const isRetryableError = (error) => {
  const type = getErrorType(error);
  return [
    ErrorTypes.NETWORK,
    ErrorTypes.TIMEOUT,
    ErrorTypes.SERVER,
  ].includes(type);
};

/**
 * Muestra un error en consola de forma amigable (solo en desarrollo)
 * 
 * @param {Object} error - Error de Axios
 * @param {string} context - Contexto donde ocurrió el error
 */
export const logError = (error, context = 'API') => {
  if (!import.meta.env.DEV) return;

  const formatted = formatError(error);
  
  console.group(`❌ [${context}] Error: ${formatted.type}`);
  console.log('Mensaje:', formatted.message);
  console.log('Status:', formatted.status);
  if (Object.keys(formatted.validationErrors).length > 0) {
    console.log('Errores de validación:', formatted.validationErrors);
  }
  if (formatted.originalError) {
    console.log('Error original:', formatted.originalError);
  }
  console.groupEnd();
};

export default {
  ErrorTypes,
  getErrorType,
  getErrorMessage,
  getValidationErrors,
  formatError,
  isErrorType,
  isRetryableError,
  logError,
};
