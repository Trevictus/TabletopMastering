/**
 * Middleware para manejar errores globales
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error de Mongoose - CastError (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID de recurso inválido',
    });
  }

  // Error de Mongoose - Validación
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }

  // Error de Mongoose - Clave duplicada
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `El ${field} ya existe`,
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  // Error genérico
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware para rutas no encontradas
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada - ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
