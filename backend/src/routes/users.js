const express = require('express');
const { body, validationResult } = require('express-validator');
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
router.post('/', authenticateToken, authorizeOwner, [
  body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['owner', 'cashier', 'manager']).withMessage('Role must be one of: owner, cashier, manager'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('full_name').optional().notEmpty().withMessage('Full name cannot be empty if provided')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

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
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

// Update user
router.put('/:id', authenticateToken, authorizeOwner, [
  body('username').optional().notEmpty().withMessage('Username cannot be empty').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('role').optional().isIn(['owner', 'cashier', 'manager']).withMessage('Role must be one of: owner, cashier, manager'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('full_name').optional().notEmpty().withMessage('Full name cannot be empty if provided'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { username, role, email, full_name, is_active } = req.body;

    const updated = await User.update(id, { username, role, email, full_name, is_active });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = await User.findById(id);
    delete updatedUser.password_hash;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Reset user password
router.put('/:id/password', authenticateToken, authorizeOwner, [
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { newPassword } = req.body;

    const updated = await User.updatePassword(id, newPassword);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// Toggle user status
router.put('/:id/status', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const { id } = req.params;

    // First get current user status
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newStatus = !user.is_active;
    const updated = await User.update(id, { is_active: newStatus });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update user status'
      });
    }

    res.json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    });
  }
});

// Delete user
router.delete('/:id', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Export users
router.get('/export', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const users = await User.findAll();

    // Convert to CSV format
    const csvHeaders = 'ID,Username,Full Name,Email,Role,Status,Created At\n';
    const csvData = users.map(user =>
      `${user.id},"${user.username}","${user.full_name || ''}","${user.email || ''}","${user.role}","${user.is_active ? 'Active' : 'Inactive'}","${user.created_at}"`
    ).join('\n');

    const csv = csvHeaders + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export users'
    });
  }
});

module.exports = router;