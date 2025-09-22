const { getPool } = require('../config/database');

class Product {
  static async findAll(filters = {}) {
    const pool = getPool();
    let query = `
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.category_id) {
      query += ' AND p.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.supplier_id) {
      query += ' AND p.supplier_id = ?';
      params.push(filters.supplier_id);
    }

    if (filters.status) {
      query += ' AND p.status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.barcode LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = ?
    `, [id]);
    return rows[0] || null;
  }

  static async findByBarcode(barcode) {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.barcode = ?
    `, [barcode]);
    return rows[0] || null;
  }

  static async create(productData) {
    const pool = getPool();
    const {
      name, category_id, barcode, description, buy_price, sell_price,
      current_stock, min_stock, unit, expiry_date, supplier_id, photo
    } = productData;

    const total_value = current_stock * sell_price;

    const [result] = await pool.execute(`
      INSERT INTO products (
        name, category_id, barcode, description, buy_price, sell_price,
        current_stock, min_stock, unit, expiry_date, supplier_id, photo, total_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, category_id, barcode, description, buy_price, sell_price,
      current_stock, min_stock, unit, expiry_date, supplier_id, photo, total_value
    ]);

    return result.insertId;
  }

  static async update(id, productData) {
    const pool = getPool();
    const {
      name, category_id, barcode, description, buy_price, sell_price,
      current_stock, min_stock, unit, expiry_date, supplier_id, photo, status
    } = productData;

    const total_value = current_stock * sell_price;

    const [result] = await pool.execute(`
      UPDATE products SET
        name = ?, category_id = ?, barcode = ?, description = ?, buy_price = ?,
        sell_price = ?, current_stock = ?, min_stock = ?, unit = ?, expiry_date = ?,
        supplier_id = ?, photo = ?, total_value = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name, category_id, barcode, description, buy_price, sell_price,
      current_stock, min_stock, unit, expiry_date, supplier_id, photo, total_value, status, id
    ]);

    return result.affectedRows > 0;
  }

  static async updateStock(id, newStock, adjustmentType = 'manual', reason = '', adjustedBy = null) {
    const pool = getPool();

    // Get current stock
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const stockDifference = newStock - product.current_stock;

    // Update product stock
    const [result] = await pool.execute(`
      UPDATE products SET
        current_stock = ?,
        total_value = ? * sell_price,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newStock, newStock, id]);

    if (result.affectedRows > 0) {
      // Record stock adjustment
      await pool.execute(`
        INSERT INTO stock_adjustments (
          product_id, adjustment_type, quantity, reason, adjusted_by
        ) VALUES (?, ?, ?, ?, ?)
      `, [id, adjustmentType, stockDifference, reason, adjustedBy]);
    }

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const pool = getPool();
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getLowStockProducts() {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.current_stock <= p.min_stock AND p.status != 'out_of_stock'
      ORDER BY (p.min_stock - p.current_stock) DESC
    `);
    return rows;
  }

  static async getOutOfStockProducts() {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.current_stock = 0 OR p.status = 'out_of_stock'
      ORDER BY p.name
    `);
    return rows;
  }

  static async getExpiredProducts() {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.expiry_date IS NOT NULL AND p.expiry_date < CURDATE()
      ORDER BY p.expiry_date
    `);
    return rows;
  }

  static async getInventorySummary() {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT
        COUNT(*) as total_products,
        SUM(total_value) as total_value,
        SUM(CASE WHEN current_stock <= min_stock THEN 1 ELSE 0 END) as low_stock_count,
        SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock_count
      FROM products
    `);
    return rows[0];
  }
}

module.exports = Product;