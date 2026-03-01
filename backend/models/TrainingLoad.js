const mongoose = require('mongoose');

const trainingLoadSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    duration: {
        type: Number,
        required: true, // Duration in minutes
    },
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    sleepHours: {
        type: Number,
        required: true,
    },
    fatigueLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('TrainingLoad', trainingLoadSchema);
