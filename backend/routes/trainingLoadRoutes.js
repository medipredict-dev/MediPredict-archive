const express = require('express');
const router = express.Router();
const {
    createTrainingLoad,
    getTrainingLoads,
    updateTrainingLoad,
    deleteTrainingLoad
} = require('../controllers/trainingLoadController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);

// Routes
router.post('/', restrictTo('Coach', 'Admin'), createTrainingLoad);
router.get('/', restrictTo('Coach', 'Admin', 'Player'), getTrainingLoads);
router.put('/:id', restrictTo('Coach', 'Admin'), updateTrainingLoad);
router.delete('/:id', restrictTo('Coach', 'Admin'), deleteTrainingLoad);

module.exports = router;
