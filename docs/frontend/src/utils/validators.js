/**
 * @fileoverview Validadores
 * @description Funciones de validación para formularios (email, password, etc.)
 * @module utils/validators
 */

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Valida una contraseña (mínimo 6 caracteres)
 * @param {string} password - Contraseña a validar
 * @returns {boolean} True si es válida
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valida un nombre de usuario (mínimo 3 caracteres)
 * @param {string} username - Nombre de usuario a validar
 * @returns {boolean} True si es válido
 */
export const validateUsername = (username) => {
  return username && username.length >= 3;
};

/**
 * Valida que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Valida un código de invitación (8 caracteres alfanuméricos)
 * @param {string} code - Código a validar
 * @returns {boolean} True si es válido
 */
export const validateInviteCode = (code) => {
  const re = /^[A-Z0-9]{8}$/;
  return re.test(code);
};

/**
 * Valida si un avatar es una imagen real subida por el usuario
 * Solo acepta imágenes en formato data:image (base64)
 * @param {string} avatar - URL o data URI del avatar
 * @returns {boolean} True si es un avatar válido subido
 */
export const isValidAvatar = (avatar) => {
  return avatar && avatar.startsWith('data:image');
};

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String con la primera letra en mayúscula
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
