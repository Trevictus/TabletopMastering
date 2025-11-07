const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT
 * @param {string} id - ID del usuario
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = generateToken;
