const express = require('express');
const router = express.Router();
const { getRecoveryProgress, getTeamAvailability } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recovery-progress', protect, getRecoveryProgress);
router.get('/recovery-progress/:playerId', protect, getRecoveryProgress);
router.get('/team-availability', protect, getTeamAvailability);

module.exports = router;
