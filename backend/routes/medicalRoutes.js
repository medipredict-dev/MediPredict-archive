const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    getAllInjuries,
    getInjuryById,
    addInjury,
    updateInjury,
    deleteInjury,
    getAllPlayers,
    getPlayerMedicalHistory,
    getMedicalStats
} = require('../controllers/medicalController');

// All routes are protected and restricted to Medical Staff role
router.use(protect);
router.use(restrictTo('Medical', 'Admin'));

// Dashboard stats
router.get('/stats', getMedicalStats);

// Players routes
router.get('/players', getAllPlayers);
router.get('/players/:id/history', getPlayerMedicalHistory);

// Injuries routes
router.get('/injuries', getAllInjuries);
router.get('/injuries/:id', getInjuryById);
router.post('/injuries', addInjury);
router.put('/injuries/:id', updateInjury);
router.delete('/injuries/:id', deleteInjury);

module.exports = router;
