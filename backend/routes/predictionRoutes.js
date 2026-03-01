const express = require('express');
const router = express.Router();
const {
    getPredictions,
    createPrediction,
    updatePrediction,
    deletePrediction
} = require('../controllers/predictionController');

router.route('/')
    .get(getPredictions)
    .post(createPrediction);

router.route('/:id')
    .put(updatePrediction)
    .delete(deletePrediction);

module.exports = router;
