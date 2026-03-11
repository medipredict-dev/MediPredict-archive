const mongoose = require('mongoose');

const predictionSchema = mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    injury: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Injury'
    },
    predictedDays: {
        type: Number,
        required: [true, 'Please provide the predicted recovery days']
    },
    confidenceScore: {
        type: Number,
        required: [true, 'Please provide a confidence score'],
        min: 0,
        max: 100
    },
    recoveryRangeMin: {
        type: Number,
        required: [true, 'Please provide the minimum recovery range']
    },
    recoveryRangeMax: {
        type: Number,
        required: [true, 'Please provide the maximum recovery range']
    },
    predictionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Accurate', 'Inaccurate'],
        default: 'Pending',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Prediction', predictionSchema);
