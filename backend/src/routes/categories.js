const express = require('express');
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const { getPool } = require('../config/database');

const router = express.Router();

// Get all categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Create category
router.post('/', authenticateToken, authorizeManager, async (req, res) => {
  try {
    const { name, description } = req.body;
    const pool = getPool();

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { id: result.insertId, name, description }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
});

module.exports = router;