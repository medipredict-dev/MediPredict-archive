const mongoose = require('mongoose');

const playerProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    age: {
        type: Number,
        required: [true, 'Please add your age']
    },
    playingRole: {
        type: String,
        required: [true, 'Please add your playing role (e.g. Batsman, Bowler, Forward)']
    },
    experienceYears: {
        type: Number,
        required: [true, 'Please add your years of experience']
    },
    height: {
        type: Number, // Storing in cm or meters (to be decided by frontend, typically cm)
        required: false
    },
    weight: {
        type: Number, // Storing in kg
        required: false
    },
    pastInjuries: {
        type: [String], // Array of strings describing past injuries
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PlayerProfile', playerProfileSchema);
