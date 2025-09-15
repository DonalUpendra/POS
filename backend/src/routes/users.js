const express = require('express');
const { authenticateToken, authorizeOwner } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all users
router.get('/', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Create user
router.post('/', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const { username, password, role, email, full_name } = req.body;
    const userId = await User.create({ username, password, role, email, full_name });

    const newUser = await User.findById(userId);
    delete newUser.password_hash; // Don't send password hash

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

module.exports = router;