const express = require('express');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// TODO: Implementar controladores de partidas

// Rutas protegidas
// router.post('/', protect, createMatch);
// router.get('/', protect, getMatches);
// router.get('/:id', protect, getMatch);
// router.put('/:id', protect, updateMatch);
// router.delete('/:id', protect, deleteMatch);
// router.post('/:id/confirm', protect, confirmAttendance);
// router.post('/:id/finish', protect, finishMatch);

module.exports = router;
