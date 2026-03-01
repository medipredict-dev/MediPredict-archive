const Prediction = require('../models/Prediction');
const User = require('../models/User'); // Import if needed to populate or check
const Injury = require('../models/Injury');

// @desc    Get all predictions (optionally filter by player)
// @route   GET /api/predictions
// @access  Public (for this assignment)
const getPredictions = async (req, res) => {
    try {
        let query = {};
        if (req.query.player) {
            query.player = req.query.player;
        }

        const predictions = await Prediction.find(query);

        res.status(200).json(predictions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new prediction
// @route   POST /api/predictions
// @access  Public
const createPrediction = async (req, res) => {
    try {
        const {
            player,
            injury,
            predictedDays,
            confidenceScore,
            recoveryRangeMin,
            recoveryRangeMax,
            predictionDate,
            status
        } = req.body;

        if (!player || !injury || predictedDays === undefined || predictedDays === '' || confidenceScore === undefined || recoveryRangeMin === undefined || recoveryRangeMax === undefined) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const prediction = await Prediction.create({
            player,
            injury,
            predictedDays,
            confidenceScore,
            recoveryRangeMin,
            recoveryRangeMax,
            predictionDate,
            status: status || 'Pending'
        });

        const fullPrediction = await Prediction.findById(prediction._id);

        res.status(201).json(fullPrediction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a prediction
// @route   PUT /api/predictions/:id
// @access  Public
const updatePrediction = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);

        if (!prediction) {
            return res.status(404).json({ message: 'Prediction not found' });
        }
        console.log("UPDATE payload body:", req.body);

        const updatedPrediction = await Prediction.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: false }
        );
        res.status(200).json(updatedPrediction);
    } catch (error) {
        res.status(400).json({ message: error.message, receivedBody: req.body });
    }
};

// @desc    Delete a prediction
// @route   DELETE /api/predictions/:id
// @access  Public
const deletePrediction = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);

        if (!prediction) {
            return res.status(404).json({ message: 'Prediction not found' });
        }

        await prediction.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPredictions,
    createPrediction,
    updatePrediction,
    deletePrediction
};
