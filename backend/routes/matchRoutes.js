const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createMatch,
  getMatches,
  getMatch,
  updateMatch,
  finishMatch,
  confirmAttendance,
  deleteMatch,
  getGlobalRanking,
  getGroupRanking,
} = require('../controllers/matchController');

const router = express.Router();

// Rutas de ranking
router.get('/ranking/global', protect, getGlobalRanking);
router.get('/ranking/group/:groupId', protect, getGroupRanking);

// Rutas protegidas
router.post('/', protect, createMatch);
router.get('/', protect, getMatches);
router.get('/:id', protect, getMatch);
router.put('/:id', protect, updateMatch);
router.post('/:id/finish', protect, finishMatch);
router.post('/:id/confirm', protect, confirmAttendance);
router.delete('/:id', protect, deleteMatch);

module.exports = router;
