const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    getTeamPlayers,
    getPlayerDetails,
    getTeamStats,
    getTeamInjuries
} = require('../controllers/coachController');

// All routes are protected and restricted to Coach role
router.use(protect);
router.use(restrictTo('Coach', 'Admin'));

router.get('/players', getTeamPlayers);
router.get('/players/:id', getPlayerDetails);
router.get('/stats', getTeamStats);
router.get('/injuries', getTeamInjuries);

module.exports = router;
