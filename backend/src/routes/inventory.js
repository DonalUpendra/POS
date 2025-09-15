const express = require('express');
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const { getPool } = require('../config/database');

const router = express.Router();

// Get inventory summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [summary] = await pool.execute(`
      SELECT
        COUNT(*) as total_products,
        SUM(total_value) as total_value,
        SUM(CASE WHEN current_stock <= min_stock THEN 1 ELSE 0 END) as low_stock_count,
        SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock_count
      FROM products
    `);

    res.json({
      success: true,
      data: summary[0]
    });
  } catch (error) {
    console.error('Get inventory summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory summary'
    });
  }
});

// Get stock adjustments
router.get('/adjustments', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [adjustments] = await pool.execute(`
      SELECT sa.*, p.name as product_name, u.username as adjusted_by_name
      FROM stock_adjustments sa
      LEFT JOIN products p ON sa.product_id = p.id
      LEFT JOIN users u ON sa.adjusted_by = u.id
      ORDER BY sa.adjustment_date DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      data: adjustments
    });
  } catch (error) {
    console.error('Get stock adjustments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock adjustments'
    });
  }
});

// Record stock adjustment
router.post('/adjustments', authenticateToken, authorizeManager, async (req, res) => {
  try {
    const { product_id, adjustment_type, quantity, reason } = req.body;
    const adjusted_by = req.user.id;
    const pool = getPool();

    const [result] = await pool.execute(`
      INSERT INTO stock_adjustments (product_id, adjustment_type, quantity, reason, adjusted_by)
      VALUES (?, ?, ?, ?, ?)
    `, [product_id, adjustment_type, quantity, reason, adjusted_by]);

    // Update product stock
    await pool.execute(`
      UPDATE products SET
        current_stock = current_stock + ?,
        total_value = (current_stock + ?) * sell_price,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [quantity, quantity, product_id]);

    res.status(201).json({
      success: true,
      message: 'Stock adjustment recorded successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create stock adjustment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record stock adjustment'
    });
  }
});

module.exports = router;