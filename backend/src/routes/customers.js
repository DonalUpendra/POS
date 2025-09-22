const express = require('express');
const { authenticateToken, authorizeCashier } = require('../middleware/auth');
const { getPool } = require('../config/database');

const router = express.Router();

// Get all customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [customers] = await pool.execute(
      'SELECT * FROM customers WHERE is_active = TRUE ORDER BY name'
    );

    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers'
    });
  }
});

// Create customer
router.post('/', authenticateToken, authorizeCashier, async (req, res) => {
  try {
    const { name, phone, email, address, city, postal_code, notes } = req.body;
    const pool = getPool();

    const [result] = await pool.execute(`
      INSERT INTO customers (name, phone, email, address, city, postal_code, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, phone, email, address, city, postal_code, notes]);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: { id: result.insertId, name, phone, email }
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer'
    });
  }
});

module.exports = router;