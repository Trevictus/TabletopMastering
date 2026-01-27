/**
 * @fileoverview Constantes de Autenticación
 * @description Claves de almacenamiento, mensajes de error y configuración de auth
 * @module constants/auth
 */

/**
 * Constantes y configuraciones para el sistema de autenticación
 */

/**
 * Claves de sessionStorage para autenticación
 * IMPORTANTE: Usamos sessionStorage (no localStorage) para aislar sesiones por pestaña
 * Esto permite que diferentes usuarios usen diferentes pestañas del mismo navegador
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  SELECTED_GROUP: 'selectedGroupId',
};

/**
 * Mensajes de error estandarizados
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
  USER_NOT_FOUND: 'Usuario no encontrado',
  INVALID_TOKEN: 'Token inválido o expirado',
  REGISTER_FAILED: 'Error al registrar usuario',
  LOGIN_FAILED: 'Error al iniciar sesión',
  PROFILE_UPDATE_FAILED: 'Error al actualizar perfil',
  GENERIC_ERROR: 'Ha ocurrido un error. Intenta nuevamente',
};

/**
 * Mensajes de éxito
 */
export const AUTH_SUCCESS = {
  LOGIN: 'Sesión iniciada correctamente',
  REGISTER: 'Registro exitoso. ¡Bienvenido!',
  LOGOUT: 'Sesión cerrada correctamente',
  PROFILE_UPDATED: 'Perfil actualizado correctamente',
};

/**
 * Rutas de autenticación
 */
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/home',
  PROFILE: '/profile',
  HOME: '/',
};

/**
 * Configuración de timeout para validación de token
 */
export const AUTH_CONFIG = {
  TOKEN_VALIDATION_TIMEOUT: 5000, // 5 segundos
  RETRY_ATTEMPTS: 3,
};

/**
 * Roles de usuario disponibles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};

export default {
  STORAGE_KEYS,
  AUTH_ERRORS,
  AUTH_SUCCESS,
  AUTH_ROUTES,
  AUTH_CONFIG,
  USER_ROLES,
};

