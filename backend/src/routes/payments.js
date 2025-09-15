const express = require('express');
const { authenticateToken, authorizeCashier } = require('../middleware/auth');
const { getPool } = require('../config/database');

const router = express.Router();

// Get payments for an order
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const pool = getPool();

    const [payments] = await pool.execute(`
      SELECT p.*, u.username as processed_by_name
      FROM payments p
      LEFT JOIN users u ON p.processed_by = u.id
      WHERE p.order_id = ?
      ORDER BY p.payment_date DESC
    `, [orderId]);

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
});

// Create payment
router.post('/', authenticateToken, authorizeCashier, async (req, res) => {
  try {
    const { order_id, payment_method, amount, reference_number, notes } = req.body;
    const processed_by = req.user.id;
    const pool = getPool();

    const [result] = await pool.execute(`
      INSERT INTO payments (order_id, payment_method, amount, reference_number, notes, processed_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [order_id, payment_method, amount, reference_number, notes, processed_by]);

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment'
    });
  }
});

module.exports = router;