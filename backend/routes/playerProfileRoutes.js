const express = require('express');
const router = express.Router();
const {
    createPlayerProfile,
    getPlayerProfile,
    updatePlayerProfile
} = require('../controllers/playerProfileController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('Player'), createPlayerProfile);
router.get('/me', protect, restrictTo('Player'), getPlayerProfile);
router.put('/me', protect, restrictTo('Player'), updatePlayerProfile);

module.exports = router;
