const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    assignRole,
    getCoaches
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public route - for player registration
router.get('/coaches', getCoaches);

router.route('/')
    .get(protect, restrictTo('Admin', 'Coach'), getUsers);

router.route('/:id')
    .get(protect, getUserById)
    .put(protect, updateUser)
    .delete(protect, restrictTo('Admin'), deleteUser);

router.route('/:id/role')
    .put(protect, restrictTo('Admin'), assignRole);

module.exports = router;
