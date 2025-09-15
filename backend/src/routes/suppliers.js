const express = require('express');
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const { getPool } = require('../config/database');

const router = express.Router();

// Get all suppliers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [suppliers] = await pool.execute(
      'SELECT * FROM suppliers WHERE status = "active" ORDER BY name'
    );

    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suppliers'
    });
  }
});

// Create supplier
router.post('/', authenticateToken, authorizeManager, async (req, res) => {
  try {
    const { name, phone, email, address, city, postal_code, contact_person, payment_terms, notes } = req.body;
    const pool = getPool();

    const [result] = await pool.execute(`
      INSERT INTO suppliers (name, phone, email, address, city, postal_code, contact_person, payment_terms, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, phone, email, address, city, postal_code, contact_person, payment_terms, notes]);

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: { id: result.insertId, name, phone, email }
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create supplier'
    });
  }
});

module.exports = router;