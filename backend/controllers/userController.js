const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin, Coach)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('roles').select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin, Coach, Medical, Self)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('roles').select('-password');

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or Self)
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            // Optional fields
            if (req.body.team) user.team = req.body.team;
            if (req.body.position) user.position = req.body.position;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            // Re-populate for response
            const populatedUser = await User.findById(updatedUser._id).populate('roles').select('-password');

            res.json({
                _id: populatedUser._id,
                name: populatedUser.name,
                email: populatedUser.email,
                roles: populatedUser.roles,
                team: populatedUser.team,
                position: populatedUser.position,
                token: generateToken(populatedUser._id), // Optional: issue new token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign Role to User
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
const assignRole = async (req, res) => {
    try {
        const { roleName } = req.body; // Expect role name, e.g. "Coach"

        const user = await User.findById(req.params.id);
        const role = await Role.findOne({ name: roleName });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Add role if not already present
        if (!user.roles.includes(role._id)) {
            user.roles.push(role._id);
            await user.save();
        }

        const updatedUser = await User.findById(user._id).populate('roles').select('-password');
        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateToken = (id) => {
    // Local helper or import from utils
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

// @desc    Get all coaches (for player registration)
// @route   GET /api/users/coaches
// @access  Public
const getCoaches = async (req, res) => {
    try {
        // Find the Coach role
        const coachRole = await Role.findOne({ name: 'Coach' });
        if (!coachRole) {
            return res.status(200).json([]);
        }

        // Find all users with Coach role
        const coaches = await User.find({ roles: coachRole._id })
            .select('_id name email')
            .sort({ name: 1 });

        res.status(200).json(coaches);
    } catch (error) {
        console.error('getCoaches error:', error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    assignRole,
    getCoaches
};
