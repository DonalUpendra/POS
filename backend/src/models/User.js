const { getPool } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, username, role, email, full_name, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByUsername(username) {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, username, password_hash, role, email, full_name, is_active FROM users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  }

  static async findAll() {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, username, role, email, full_name, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  static async create(userData) {
    const pool = getPool();
    const { username, password, role, email, full_name } = userData;

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.execute(
      'INSERT INTO users (username, password_hash, role, email, full_name) VALUES (?, ?, ?, ?, ?)',
      [username, password_hash, role, email, full_name]
    );

    return result.insertId;
  }

  static async update(id, userData) {
    const pool = getPool();
    const { username, role, email, full_name, is_active } = userData;

    const [result] = await pool.execute(
      'UPDATE users SET username = ?, role = ?, email = ?, full_name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [username, role, email, full_name, is_active, id]
    );

    return result.affectedRows > 0;
  }

  static async updatePassword(id, newPassword) {
    const pool = getPool();
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    const [result] = await pool.execute(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [password_hash, id]
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const pool = getPool();
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;