const express = require('express');
const { body } = require('express-validator');
const {
  createGroup,
  getMyGroups,
  getGroup,
  joinGroup,
} = require('../controllers/groupController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

const router = express.Router();

// Validaciones
const createGroupValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del grupo es obligatorio')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  body('avatar').optional().isURL().withMessage('El avatar debe ser una URL válida'),
];

const joinGroupValidation = [
  body('inviteCode')
    .trim()
    .notEmpty()
    .withMessage('El código de invitación es obligatorio')
    .isLength({ min: 8, max: 8 })
    .withMessage('El código debe tener 8 caracteres'),
];

// Rutas protegidas
router.post('/', protect, createGroupValidation, validate, createGroup);
router.get('/', protect, getMyGroups);
router.get('/:id', protect, getGroup);
router.post('/join', protect, joinGroupValidation, validate, joinGroup);

module.exports = router;
