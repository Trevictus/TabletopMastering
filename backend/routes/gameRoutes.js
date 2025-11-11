const express = require('express');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const {
  createGameValidation,
  addFromBGGValidation,
  updateGameValidation,
  searchBGGValidation,
  getBGGDetailsValidation,
  getGamesValidation,
  idParamValidation,
  groupStatsValidation,
  hotGamesValidation,
} = require('../middlewares/gameValidator');
const {
  searchBGG,
  getBGGDetails,
  addFromBGG,
  createGame,
  getGames,
  getGame,
  updateGame,
  syncBGGGame,
  deleteGame,
  getHotGames,
  getGroupGameStats,
} = require('../controllers/gameController');

const router = express.Router();

// Rutas de BGG (búsqueda y obtención de datos externos)
router.get('/search-bgg', protect, searchBGGValidation, validate, searchBGG);
router.get('/bgg/hot', protect, hotGamesValidation, validate, getHotGames);
router.get('/bgg/:bggId', protect, getBGGDetailsValidation, validate, getBGGDetails);

// Rutas de gestión de juegos
router.post('/add-from-bgg', protect, addFromBGGValidation, validate, addFromBGG);
router.post('/', protect, createGameValidation, validate, createGame);
router.get('/', protect, getGamesValidation, validate, getGames);
router.get('/stats/:groupId', protect, groupStatsValidation, validate, getGroupGameStats);
router.get('/:id', protect, idParamValidation, validate, getGame);
router.put('/:id', protect, updateGameValidation, validate, updateGame);
router.put('/:id/sync-bgg', protect, idParamValidation, validate, syncBGGGame);
router.delete('/:id', protect, idParamValidation, validate, deleteGame);

module.exports = router;


