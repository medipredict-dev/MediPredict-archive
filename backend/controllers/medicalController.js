const User = require('../models/User');
const Role = require('../models/Role');
const PlayerProfile = require('../models/PlayerProfile');
const Injury = require('../models/Injury');

// @desc    Get all injuries
// @route   GET /api/medical/injuries
// @access  Private (Medical Staff only)
const getAllInjuries = async (req, res) => {
    try {
        const { status, severity, playerId } = req.query;
        
        let filter = {};
        if (status) filter.status = status;
        if (severity) filter.severity = severity;
        if (playerId) filter.playerId = playerId;

        const injuries = await Injury.find(filter)
            .populate('playerId', 'name email team position')
            .populate('addedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(injuries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single injury record
// @route   GET /api/medical/injuries/:id
// @access  Private (Medical Staff only)
const getInjuryById = async (req, res) => {
    try {
        const injury = await Injury.findById(req.params.id)
            .populate('playerId', 'name email team position')
            .populate('addedBy', 'name');

        if (!injury) {
            return res.status(404).json({ message: 'Injury record not found' });
        }

        res.json(injury);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new injury record
// @route   POST /api/medical/injuries
// @access  Private (Medical Staff only)
const addInjury = async (req, res) => {
    try {
        const {
            playerId,
            injuryType,
            bodyPart,
            severity,
            description,
            dateOfInjury,
            expectedRecoveryDays,
            treatment,
            notes
        } = req.body;

        // Verify player exists
        const player = await User.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Calculate risk level based on severity and injury type
        let riskLevel = 'Low';
        if (severity === 'Severe' || severity === 'Critical') {
            riskLevel = 'High';
        } else if (severity === 'Moderate') {
            riskLevel = 'Medium';
        }

        // Simple prediction for recovery days if not provided
        let predictedRecoveryDays = expectedRecoveryDays;
        if (!predictedRecoveryDays) {
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
            predictedRecoveryDays = recoveryEstimates[injuryType]?.[severity] || 14;
        }

        const injury = await Injury.create({
            playerId,
            injuryType,
            bodyPart,
            severity,
            description,
            dateOfInjury: dateOfInjury || Date.now(),
            expectedRecoveryDays,
            treatment,
            notes,
            addedBy: req.user._id,
            predictedRecoveryDays,
            riskLevel
        });

        const populatedInjury = await Injury.findById(injury._id)
            .populate('playerId', 'name email team position')
            .populate('addedBy', 'name');

        res.status(201).json(populatedInjury);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an injury record
// @route   PUT /api/medical/injuries/:id
// @access  Private (Medical Staff only)
const updateInjury = async (req, res) => {
    try {
        const injury = await Injury.findById(req.params.id);

        if (!injury) {
            return res.status(404).json({ message: 'Injury record not found' });
        }

        const {
            status,
            treatment,
            notes,
            actualRecoveryDate,
            expectedRecoveryDays
        } = req.body;

        // Update fields
        if (status) injury.status = status;
        if (treatment) injury.treatment = treatment;
        if (notes) injury.notes = notes;
        if (actualRecoveryDate) injury.actualRecoveryDate = actualRecoveryDate;
        if (expectedRecoveryDays) injury.expectedRecoveryDays = expectedRecoveryDays;

        // If status is changed to Recovered, set actual recovery date
        if (status === 'Recovered' && !injury.actualRecoveryDate) {
            injury.actualRecoveryDate = Date.now();
        }

        const updatedInjury = await injury.save();

        const populatedInjury = await Injury.findById(updatedInjury._id)
            .populate('playerId', 'name email team position')
            .populate('addedBy', 'name');

        res.json(populatedInjury);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an injury record
// @route   DELETE /api/medical/injuries/:id
// @access  Private (Medical Staff only)
const deleteInjury = async (req, res) => {
    try {
        const injury = await Injury.findById(req.params.id);

        if (!injury) {
            return res.status(404).json({ message: 'Injury record not found' });
        }

        await injury.deleteOne();

        res.json({ message: 'Injury record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all players for medical view
// @route   GET /api/medical/players
// @access  Private (Medical Staff only)
const getAllPlayers = async (req, res) => {
    try {
        const playerRole = await Role.findOne({ name: 'Player' });
        
        if (!playerRole) {
            return res.status(404).json({ message: 'Player role not found' });
        }

        const players = await User.find({ roles: playerRole._id })
            .select('name email team position')
            .sort({ name: 1 });

        res.json(players);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get player's medical history
// @route   GET /api/medical/players/:id/history
// @access  Private (Medical Staff only)
const getPlayerMedicalHistory = async (req, res) => {
    try {
        const player = await User.findById(req.params.id).select('-password');

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const profile = await PlayerProfile.findOne({ userId: player._id });
        const injuries = await Injury.find({ playerId: player._id })
            .populate('addedBy', 'name')
            .sort({ dateOfInjury: -1 });

        const stats = {
            totalInjuries: injuries.length,
            activeInjuries: injuries.filter(i => i.status === 'Active').length,
            recoveringInjuries: injuries.filter(i => i.status === 'Recovering').length,
            recoveredInjuries: injuries.filter(i => i.status === 'Recovered').length,
            chronicInjuries: injuries.filter(i => i.status === 'Chronic').length
        };

        res.json({
            player: {
                _id: player._id,
                name: player.name,
                email: player.email,
                team: player.team,
                position: player.position
            },
            profile,
            injuries,
            stats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get medical dashboard statistics
// @route   GET /api/medical/stats
// @access  Private (Medical Staff only)
const getMedicalStats = async (req, res) => {
    try {
        const playerRole = await Role.findOne({ name: 'Player' });
        const totalPlayers = await User.countDocuments({ roles: playerRole._id });
        
        const allInjuries = await Injury.find();
        const activeInjuries = allInjuries.filter(i => i.status === 'Active');
        const recoveringInjuries = allInjuries.filter(i => i.status === 'Recovering');
        
        // Group injuries by type
        const injuryByType = {};
        allInjuries.forEach(injury => {
            injuryByType[injury.injuryType] = (injuryByType[injury.injuryType] || 0) + 1;
        });

        // Group injuries by body part
        const injuryByBodyPart = {};
        allInjuries.forEach(injury => {
            injuryByBodyPart[injury.bodyPart] = (injuryByBodyPart[injury.bodyPart] || 0) + 1;
        });

        // Group by severity
        const injuryBySeverity = {};
        allInjuries.forEach(injury => {
            injuryBySeverity[injury.severity] = (injuryBySeverity[injury.severity] || 0) + 1;
        });

        // Recent injuries (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentInjuries = allInjuries.filter(i => new Date(i.createdAt) >= oneWeekAgo).length;

        res.json({
            totalPlayers,
            totalInjuries: allInjuries.length,
            activeInjuries: activeInjuries.length,
            recoveringInjuries: recoveringInjuries.length,
            recentInjuries,
            injuryByType,
            injuryByBodyPart,
            injuryBySeverity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllInjuries,
    getInjuryById,
    addInjury,
    updateInjury,
    deleteInjury,
    getAllPlayers,
    getPlayerMedicalHistory,
    getMedicalStats
};
