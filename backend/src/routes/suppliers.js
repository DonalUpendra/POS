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

    // Generate supplier_id if not provided
    let supplier_id = req.body.supplier_id;
    if (!supplier_id) {
      supplier_id = 'SUP' + Date.now().toString().slice(-6);
    }

    const [result] = await pool.execute(`
      INSERT INTO suppliers (supplier_id, name, phone, email, address, city, postal_code, contact_person, payment_terms, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [supplier_id, name, phone, email, address, city, postal_code, contact_person, payment_terms, notes]);

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: { id: result.insertId, supplier_id, name, phone, email }
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create supplier'
    });
  }
});

// Update supplier
router.put('/:id', authenticateToken, authorizeManager, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, city, postal_code, contact_person, payment_terms, notes } = req.body;
    const pool = getPool();

    const [result] = await pool.execute(`
      UPDATE suppliers
      SET name = ?, phone = ?, email = ?, address = ?, city = ?, postal_code = ?, contact_person = ?, payment_terms = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, phone, email, address, city, postal_code, contact_person, payment_terms, notes, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      message: 'Supplier updated successfully'
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update supplier'
    });
  }
});

// Delete supplier (soft delete by setting status to inactive)
router.delete('/:id', authenticateToken, authorizeManager, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [result] = await pool.execute(`
      UPDATE suppliers
      SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete supplier'
    });
  }
});

// Toggle supplier status
router.patch('/:id/status', authenticateToken, authorizeManager, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Get current status
    const [current] = await pool.execute('SELECT status FROM suppliers WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    const newStatus = current[0].status === 'active' ? 'inactive' : 'active';

    await pool.execute(`
      UPDATE suppliers
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newStatus, id]);

    res.json({
      success: true,
      message: `Supplier status changed to ${newStatus}`,
      data: { status: newStatus }
    });
  } catch (error) {
    console.error('Toggle supplier status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle supplier status'
    });
  }
});

// Get supplier by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [suppliers] = await pool.execute('SELECT * FROM suppliers WHERE id = ?', [id]);

    if (suppliers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      data: suppliers[0]
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supplier'
    });
  }
});

module.exports = router;