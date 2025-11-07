const express = require('express');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// TODO: Implementar controladores de juegos

// Rutas protegidas
// router.post('/', protect, createGame);
// router.get('/', protect, getGames);
// router.get('/:id', protect, getGame);
// router.put('/:id', protect, updateGame);
// router.delete('/:id', protect, deleteGame);

module.exports = router;
