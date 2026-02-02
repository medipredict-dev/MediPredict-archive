const PlayerProfile = require('../models/PlayerProfile');

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

module.exports = {
    createPlayerProfile,
    getPlayerProfile,
    updatePlayerProfile
};
