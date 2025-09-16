const express = require('express');
const { authenticateToken, authorizeCashier } = require('../middleware/auth');
const { getPool } = require('../config/database');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [orders] = await pool.execute(`
      SELECT o.*, c.name as customer_name, u.username as cashier_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Create order
router.post('/', authenticateToken, authorizeCashier, async (req, res) => {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();

    const { customer_id, items, discount_amount = 0, tax_amount = 0, payment_method, payment_amount } = req.body;
    const user_id = req.user.id;

    // Generate order number
    const orderNumber = `ORD${Date.now()}`;

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.quantity * item.price;
    }
    const final_amount = subtotal - discount_amount + tax_amount;

    // Create order
    const [orderResult] = await connection.execute(`
      INSERT INTO orders (order_number, customer_id, user_id, total_amount, discount_amount, tax_amount, final_amount, status, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', 'paid')
    `, [orderNumber, customer_id, user_id, subtotal, discount_amount, tax_amount, final_amount]);

    const orderId = orderResult.insertId;

    // Add order items and update stock
    for (const item of items) {
      await connection.execute(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, item.price, item.quantity * item.price]);

      // Update product stock
      await connection.execute(`
        UPDATE products SET current_stock = current_stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `, [item.quantity, item.product_id]);
    }

    // Create payment record
    await connection.execute(`
      INSERT INTO payments (order_id, payment_method, amount, processed_by)
      VALUES (?, ?, ?, ?)
    `, [orderId, payment_method, payment_amount, user_id]);

    await connection.commit();

    // Log order creation activity
    try {
      await ActivityLog.create({
        user_id: user_id,
        action: 'order_created',
        description: `Created order ${orderNumber} with ${items.length} items, total: $${final_amount.toFixed(2)}`,
        entity_type: 'order',
        entity_id: orderId,
        ip_address: req.ip || req.connection.remoteAddress || 'unknown'
      });
    } catch (logError) {
      console.error('Failed to log order creation activity:', logError);
      // Don't fail the order creation if logging fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order_id: orderId, order_number: orderNumber }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  } finally {
    connection.release();
  }
});

module.exports = router;