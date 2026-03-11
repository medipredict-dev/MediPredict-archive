const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const PlayerProfile = require('../models/PlayerProfile');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, roleName, coachId } = req.body; // Accept roleName optionally, default to Player

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Find role by name (default to 'Player')
        const roleToAssignName = roleName || 'Player';
        const roleDoc = await Role.findOne({ name: roleToAssignName });

        if (!roleDoc) {
            return res.status(400).json({ message: `Role '${roleToAssignName}' not found.` });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            roles: [roleDoc._id],
            coachId: coachId || null
        });

        if (user) {
            // Populate roles for response
            const populatedUser = await User.findById(user._id).populate('roles');

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                roles: populatedUser.roles,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password').populate('roles');

        if (user && (await user.matchPassword(password))) {
            let needsProfile = false;
            // Check if user has 'Player' role and if they have a profile
            const isPlayer = user.roles.some(role => role.name === 'Player');
            if (isPlayer) {
                const profile = await PlayerProfile.findOne({ userId: user._id });
                if (!profile) {
                    needsProfile = true;
                }
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                token: generateToken(user._id),
                needsProfile
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is already set by the middleware
    const { _id, name, email, roles, createdAt, team, position } = req.user;

    res.status(200).json({
        id: _id,
        name,
        email,
        roles,
        team,
        position,
        createdAt
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
