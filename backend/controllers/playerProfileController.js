const PlayerProfile = require('../models/PlayerProfile');
const Injury = require('../models/Injury');

// @desc    Create player profile
// @route   POST /api/player-profile
// @access  Private (Player only)
const createPlayerProfile = async (req, res) => {
    try {
        const { age, playingRole, experienceYears, height, weight, pastInjuries } = req.body;

        // Check if profile already exists
        const profileExists = await PlayerProfile.findOne({ userId: req.user.id });

        if (profileExists) {
            return res.status(400).json({ message: 'Player profile already exists' });
        }

        const playerProfile = await PlayerProfile.create({
            userId: req.user.id,
            age,
            playingRole,
            experienceYears,
            height,
            weight,
            pastInjuries
        });

        res.status(201).json(playerProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current player's profile
// @route   GET /api/player-profile/me
// @access  Private (Player only)
const getPlayerProfile = async (req, res) => {
    try {
        const profile = await PlayerProfile.findOne({ userId: req.user.id });

        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ message: 'Player profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update player profile
// @route   PUT /api/player-profile/me
// @access  Private (Player only)
const updatePlayerProfile = async (req, res) => {
    try {
        const profile = await PlayerProfile.findOne({ userId: req.user.id });

        if (profile) {
            profile.age = req.body.age || profile.age;
            profile.playingRole = req.body.playingRole || profile.playingRole;
            profile.experienceYears = req.body.experienceYears || profile.experienceYears;
            profile.height = req.body.height || profile.height;
            profile.weight = req.body.weight || profile.weight;
            profile.pastInjuries = req.body.pastInjuries || profile.pastInjuries;

            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: 'Player profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get player's own injuries
// @route   GET /api/player-profile/injuries
// @access  Private (Player only)
const getPlayerInjuries = async (req, res) => {
    try {
        const injuries = await Injury.find({ playerId: req.user._id })
            .populate('addedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(injuries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Player submits a new injury
// @route   POST /api/player-profile/injuries
// @access  Private (Player only)
const addPlayerInjury = async (req, res) => {
    try {
        console.log('addPlayerInjury called');
        console.log('req.user:', req.user?._id);
        console.log('req.body:', req.body);
        
        const {
            injuryType,
            bodyPart,
            severity,
            description,
            dateOfInjury,
            painLevel
        } = req.body;

        // Calculate risk level based on severity
        let riskLevel = 'Low';
        if (severity === 'Severe' || severity === 'Critical') {
            riskLevel = 'High';
        } else if (severity === 'Moderate') {
            riskLevel = 'Medium';
        }

        // Simple prediction for recovery days
        const recoveryEstimates = {
            'Muscle Strain': { Minor: 7, Moderate: 21, Severe: 42, Critical: 60 },
            'Ligament Sprain': { Minor: 14, Moderate: 42, Severe: 90, Critical: 180 },
            'Fracture': { Minor: 42, Moderate: 60, Severe: 90, Critical: 120 },
            'Concussion': { Minor: 7, Moderate: 14, Severe: 30, Critical: 60 },
            'Tendinitis': { Minor: 14, Moderate: 28, Severe: 42, Critical: 60 },
            'Dislocation': { Minor: 21, Moderate: 42, Severe: 60, Critical: 90 },
            'Contusion': { Minor: 3, Moderate: 7, Severe: 14, Critical: 21 },
            'Other': { Minor: 7, Moderate: 14, Severe: 28, Critical: 42 }
        };
        const predictedRecoveryDays = recoveryEstimates[injuryType]?.[severity] || 14;

        const injury = await Injury.create({
            playerId: req.user._id,
            injuryType,
            bodyPart,
            severity,
            description,
            dateOfInjury: dateOfInjury || Date.now(),
            painLevel,
            status: 'Active',
            addedBy: req.user._id,
            predictedRecoveryDays,
            riskLevel
        });

        const populatedInjury = await Injury.findById(injury._id)
            .populate('addedBy', 'name');

        res.status(201).json(populatedInjury);
    } catch (error) {
        console.error('addPlayerInjury error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPlayerProfile,
    getPlayerProfile,
    updatePlayerProfile,
    getPlayerInjuries,
    addPlayerInjury
};
