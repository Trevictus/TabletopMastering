/**
 * @fileoverview Middleware de Validación
 * @description Procesa resultados de express-validator y formatea errores
 * @module middlewares/validator
 * @requires express-validator
 */

const { validationResult } = require('express-validator');

/**
 * Middleware para validar los resultados de express-validator
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map((error) => ({
        field: error.path || error.param,
        message: error.msg,
      })),
    });
  }

  next();
};

module.exports = { validate };
