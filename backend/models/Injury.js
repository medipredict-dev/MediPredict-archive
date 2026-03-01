const mongoose = require('mongoose');

const injurySchema = mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    injuryType: {
        type: String,
        required: [true, 'Please add injury type'],
        enum: ['Muscle Strain', 'Ligament Sprain', 'Fracture', 'Concussion', 'Tendinitis', 'Dislocation', 'Contusion', 'Other']
    },
    bodyPart: {
        type: String,
        required: [true, 'Please specify the body part affected'],
        enum: ['Head', 'Neck', 'Shoulder', 'Arm', 'Elbow', 'Wrist', 'Hand', 'Back', 'Hip', 'Thigh', 'Knee', 'Ankle', 'Foot', 'Other']
    },
    severity: {
        type: String,
        required: true,
        enum: ['Minor', 'Moderate', 'Severe', 'Critical']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    dateOfInjury: {
        type: Date,
        required: [true, 'Please add date of injury'],
        default: Date.now
    },
    expectedRecoveryDays: {
        type: Number,
        required: false
    },
    actualRecoveryDate: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['Active', 'Recovering', 'Recovered', 'Chronic'],
        default: 'Active'
    },
    treatment: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    treatedBy: {
        type: String,
        required: false,
        trim: true
    },
    painLevel: {
        type: Number,
        required: false,
        min: 1,
        max: 10
    },
    clearedForTraining: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    predictedRecoveryDays: {
        type: Number,
        required: false
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Injury', injurySchema);
