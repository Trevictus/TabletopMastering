/**
 * @fileoverview Manejador de Errores
 * @description Funciones para manejo centralizado de errores de API
 * @module utils/errorHandler
 */

/**
 * Maneja errores de las peticiones API
 * @param {Error} error - Error de axios
 * @returns {string} Mensaje de error formateado
 */
export const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    return error.response.data?.message || 'Error en el servidor';
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    return 'No se pudo conectar con el servidor';
  } else {
    // Algo pasó al configurar la petición
    return error.message || 'Error desconocido';
  }
};

/**
 * Muestra un mensaje de éxito
 * @param {string} message - Mensaje a mostrar
 */
export const showSuccess = (message) => {
  // Implementar con librería de toasts o notificaciones
  console.log('✅ Éxito:', message);
};

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje a mostrar
 */
export const showError = (message) => {
  // Implementar con librería de toasts o notificaciones
  console.error('❌ Error:', message);
};
