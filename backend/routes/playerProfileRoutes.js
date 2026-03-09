const express = require('express');
const router = express.Router();
const {
    createPlayerProfile,
    getPlayerProfile,
    updatePlayerProfile,
    getPlayerInjuries,
    addPlayerInjury
} = require('../controllers/playerProfileController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('Player'), createPlayerProfile);
router.get('/me', protect, restrictTo('Player'), getPlayerProfile);
router.put('/me', protect, restrictTo('Player'), updatePlayerProfile);

// Player's own injuries
router.get('/injuries', protect, restrictTo('Player'), getPlayerInjuries);
router.post('/injuries', protect, restrictTo('Player'), addPlayerInjury);

module.exports = router;
