const { body, query, param } = require('express-validator');

/**
 * Validaciones para la creación de juegos personalizados
 */
exports.createGameValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre del juego es obligatorio')
    .isLength({ min: 2, max: 150 }).withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La descripción no puede exceder 2000 caracteres'),
  
  body('groupId')
    .notEmpty().withMessage('El ID del grupo es obligatorio')
    .isMongoId().withMessage('ID de grupo inválido'),
  
  body('minPlayers')
    .notEmpty().withMessage('El número mínimo de jugadores es obligatorio')
    .isInt({ min: 1 }).withMessage('Debe haber al menos 1 jugador'),
  
  body('maxPlayers')
    .notEmpty().withMessage('El número máximo de jugadores es obligatorio')
    .isInt({ min: 1 }).withMessage('Debe haber al menos 1 jugador')
    .custom((value, { req }) => {
      if (value < req.body.minPlayers) {
        throw new Error('El máximo de jugadores debe ser mayor o igual al mínimo');
      }
      return true;
    }),
  
  body('playingTime')
    .optional()
    .isInt({ min: 0 }).withMessage('El tiempo de juego debe ser un número positivo'),
  
  body('categories')
    .optional()
    .isArray().withMessage('Las categorías deben ser un array'),
  
  body('mechanics')
    .optional()
    .isArray().withMessage('Las mecánicas deben ser un array'),
  
  body('difficulty')
    .optional()
    .isIn(['fácil', 'medio', 'difícil', 'experto', '']).withMessage('Dificultad inválida'),
  
  body('yearPublished')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() + 5 })
    .withMessage('Año de publicación inválido'),
  
  body('image')
    .optional()
    .trim()
    .isURL().withMessage('La URL de la imagen no es válida'),
];

/**
 * Validaciones para añadir juego desde BGG
 */
exports.addFromBGGValidation = [
  body('bggId')
    .notEmpty().withMessage('El ID de BGG es obligatorio')
    .isInt({ min: 1 }).withMessage('ID de BGG inválido'),
  
  body('groupId')
    .notEmpty().withMessage('El ID del grupo es obligatorio')
    .isMongoId().withMessage('ID de grupo inválido'),
  
  body('customNotes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas no pueden exceder 500 caracteres'),
];

/**
 * Validaciones para actualización de juegos
 */
exports.updateGameValidation = [
  param('id')
    .isMongoId().withMessage('ID de juego inválido'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 }).withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La descripción no puede exceder 2000 caracteres'),
  
  body('minPlayers')
    .optional()
    .isInt({ min: 1 }).withMessage('Debe haber al menos 1 jugador'),
  
  body('maxPlayers')
    .optional()
    .isInt({ min: 1 }).withMessage('Debe haber al menos 1 jugador'),
  
  body('playingTime')
    .optional()
    .isInt({ min: 0 }).withMessage('El tiempo de juego debe ser un número positivo'),
  
  body('difficulty')
    .optional()
    .isIn(['fácil', 'medio', 'difícil', 'experto', '']).withMessage('Dificultad inválida'),
  
  body('customNotes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas no pueden exceder 500 caracteres'),
];

/**
 * Validaciones para búsqueda en BGG
 */
exports.searchBGGValidation = [
  query('name')
    .notEmpty().withMessage('El parámetro "name" es obligatorio')
    .trim()
    .isLength({ min: 2 }).withMessage('El término de búsqueda debe tener al menos 2 caracteres'),
  
  query('exact')
    .optional()
    .isIn(['true', 'false']).withMessage('El parámetro "exact" debe ser true o false'),
];

/**
 * Validaciones para obtener detalles de BGG
 */
exports.getBGGDetailsValidation = [
  param('bggId')
    .isInt({ min: 1 }).withMessage('ID de BGG inválido'),
];

/**
 * Validaciones para listar juegos
 */
exports.getGamesValidation = [
  query('groupId')
    .optional()
    .isMongoId().withMessage('ID de grupo inválido'),
  
  query('source')
    .optional()
    .isIn(['bgg', 'custom']).withMessage('Fuente inválida. Debe ser "bgg" o "custom"'),
  
  query('search')
    .optional()
    .trim(),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
];

/**
 * Validaciones para parámetro de ID
 */
exports.idParamValidation = [
  param('id')
    .isMongoId().withMessage('ID inválido'),
];

/**
 * Validaciones para estadísticas de grupo
 */
exports.groupStatsValidation = [
  param('groupId')
    .isMongoId().withMessage('ID de grupo inválido'),
];

/**
 * Validaciones para juegos populares
 */
exports.hotGamesValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('El límite debe estar entre 1 y 50'),
];
