const express = require('express');
const { getAllUsers, getUserById } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin', 'manager'), getAllUsers);
router.get('/:id', protect, authorize('admin', 'manager'), getUserById);

module.exports = router;
