const TrainingLoad = require('../models/TrainingLoad');

// @desc    Create a new training load entry
// @route   POST /api/training-load
// @access  Private (Coach/Admin)
const createTrainingLoad = async (req, res) => {
    try {
        const { player, date, duration, intensity, sleepHours, fatigueLevel, notes } = req.body;

        if (!player || !duration || !intensity || !sleepHours || !fatigueLevel) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const trainingLoad = new TrainingLoad({
            player,
            date: date || Date.now(),
            duration,
            intensity,
            sleepHours,
            fatigueLevel,
            notes
        });

        const savedLoad = await trainingLoad.save();
        res.status(201).json(savedLoad);
    } catch (error) {
        console.error('Error creating training load:', error);
        res.status(500).json({ message: 'Server error creating training load', error: error.message });
    }
};

// @desc    Get all training loads (with optional date range and player filter)
// @route   GET /api/training-load
// @access  Private
const getTrainingLoads = async (req, res) => {
    try {
        const { startDate, endDate, player } = req.query;
        let query = {};

        // Filter by player if provided
        if (player) {
            query.player = player;
        }

        // Filter by date range if provided
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const trainingLoads = await TrainingLoad.find(query)
            .populate('player', 'name email')
            .sort({ date: -1 });

        res.json(trainingLoads);
    } catch (error) {
        console.error('Error fetching training loads:', error);
        res.status(500).json({ message: 'Server error fetching training loads', error: error.message });
    }
};

// @desc    Update a training load entry
// @route   PUT /api/training-load/:id
// @access  Private (Coach/Admin)
const updateTrainingLoad = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedLoad = await TrainingLoad.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('player', 'name email');

        if (!updatedLoad) {
            return res.status(404).json({ message: 'Training load not found' });
        }

        res.json(updatedLoad);
    } catch (error) {
        console.error('Error updating training load:', error);
        res.status(500).json({ message: 'Server error updating training load', error: error.message });
    }
};

// @desc    Delete a training load entry
// @route   DELETE /api/training-load/:id
// @access  Private (Coach/Admin)
const deleteTrainingLoad = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLoad = await TrainingLoad.findByIdAndDelete(id);

        if (!deletedLoad) {
            return res.status(404).json({ message: 'Training load not found' });
        }

        res.json({ message: 'Training load deleted successfully', id });
    } catch (error) {
        console.error('Error deleting training load:', error);
        res.status(500).json({ message: 'Server error deleting training load', error: error.message });
    }
};

module.exports = {
    createTrainingLoad,
    getTrainingLoads,
    updateTrainingLoad,
    deleteTrainingLoad
};
