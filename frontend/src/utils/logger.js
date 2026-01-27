/**
 * @fileoverview Logger personalizado para desarrollo
 * @description Sistema de logging minimalista con niveles y colores
 * @module utils/logger
 */

const isDev = import.meta.env.DEV;

const COLORS = {
  info: '#0ea5e9',      // Azul
  warn: '#eab308',      // Amarillo
  error: '#ef4444',     // Rojo
  debug: '#8b5cf6',     // Púrpura
  success: '#22c55e',   // Verde
};

/**
 * Logger personalizado con niveles y módulos
 * Solo muestra logs en desarrollo
 * 
 * @example
 * const logger = new Logger('AuthService');
 * logger.info('Usuario autenticado');
 * logger.error('Error de conexión', { status: 500 });
 */
class Logger {
  /**
   * @param {string} module - Nombre del módulo (para identificación)
   */
  constructor(module) {
    this.module = module;
  }

  /**
   * Log base con nivel y datos opcionales
   * @private
   */
  log(level, message, data = null) {
    if (!isDev) return;

    const timestamp = new Date().toLocaleTimeString();
    const style = `color: ${COLORS[level]}; font-weight: bold;`;
    const prefix = `[${timestamp}] ${this.module}`;

    if (data) {
      console.log(`%c${prefix}`, style, message, data);
    } else {
      console.log(`%c${prefix}`, style, message);
    }
  }

  /**
   * Log informativo
   * @param {string} message
   * @param {*} data - Datos adicionales opcionales
   */
  info(message, data) {
    this.log('info', message, data);
  }

  /**
   * Log de advertencia
   * @param {string} message
   * @param {*} data - Datos adicionales opcionales
   */
  warn(message, data) {
    this.log('warn', message, data);
  }

  /**
   * Log de error
   * @param {string} message
   * @param {*} data - Datos adicionales opcionales
   */
  error(message, data) {
    this.log('error', message, data);
  }

  /**
   * Log de depuración
   * @param {string} message
   * @param {*} data - Datos adicionales opcionales
   */
  debug(message, data) {
    this.log('debug', message, data);
  }

  /**
   * Log de éxito
   * @param {string} message
   * @param {*} data - Datos adicionales opcionales
   */
  success(message, data) {
    this.log('success', message, data);
  }
}

export default Logger;
