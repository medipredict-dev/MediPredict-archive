const User = require('../models/User');
const Role = require('../models/Role');
const PlayerProfile = require('../models/PlayerProfile');
const Injury = require('../models/Injury');

// @desc    Get all players (for coach to view team)
// @route   GET /api/coach/players
// @access  Private (Coach only)
const getTeamPlayers = async (req, res) => {
    try {
        // Find the Player role
        const playerRole = await Role.findOne({ name: 'Player' });
        
        if (!playerRole) {
            return res.status(404).json({ message: 'Player role not found' });
        }

        // Find all users with Player role
        const players = await User.find({ roles: playerRole._id })
            .select('-password')
            .populate('roles');

        // Get profiles for each player
        const playersWithProfiles = await Promise.all(
            players.map(async (player) => {
                const profile = await PlayerProfile.findOne({ userId: player._id });
                const activeInjuries = await Injury.find({ 
                    playerId: player._id, 
                    status: { $in: ['Active', 'Recovering'] } 
                });
                
                return {
                    _id: player._id,
                    name: player.name,
                    email: player.email,
                    team: player.team,
                    position: player.position,
                    profile: profile || null,
                    activeInjuries: activeInjuries.length,
                    injuryStatus: activeInjuries.length > 0 ? 'Injured' : 'Fit'
                };
            })
        );

        res.json(playersWithProfiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single player's details
// @route   GET /api/coach/players/:id
// @access  Private (Coach only)
const getPlayerDetails = async (req, res) => {
    try {
        const player = await User.findById(req.params.id)
            .select('-password')
            .populate('roles');

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const profile = await PlayerProfile.findOne({ userId: player._id });
        const injuries = await Injury.find({ playerId: player._id })
            .sort({ createdAt: -1 });

        res.json({
            player: {
                _id: player._id,
                name: player.name,
                email: player.email,
                team: player.team,
                position: player.position,
                roles: player.roles
            },
            profile,
            injuries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get team statistics
// @route   GET /api/coach/stats
// @access  Private (Coach only)
const getTeamStats = async (req, res) => {
    try {
        const playerRole = await Role.findOne({ name: 'Player' });
        
        if (!playerRole) {
            return res.status(404).json({ message: 'Player role not found' });
        }

        const totalPlayers = await User.countDocuments({ roles: playerRole._id });
        
        // Count players with active injuries
        const activeInjuries = await Injury.find({ status: { $in: ['Active', 'Recovering'] } });
        const injuredPlayerIds = [...new Set(activeInjuries.map(i => i.playerId.toString()))];
        
        const stats = {
            totalPlayers,
            fitPlayers: totalPlayers - injuredPlayerIds.length,
            injuredPlayers: injuredPlayerIds.length,
            totalActiveInjuries: activeInjuries.length,
            injuryBreakdown: {
                active: activeInjuries.filter(i => i.status === 'Active').length,
                recovering: activeInjuries.filter(i => i.status === 'Recovering').length
            }
        };

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all injuries for coach view
// @route   GET /api/coach/injuries
// @access  Private (Coach only)
const getTeamInjuries = async (req, res) => {
    try {
        const injuries = await Injury.find()
            .populate('playerId', 'name email team position')
            .populate('addedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(injuries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTeamPlayers,
    getPlayerDetails,
    getTeamStats,
    getTeamInjuries
};
