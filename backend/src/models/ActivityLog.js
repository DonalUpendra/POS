const { getPool } = require('../config/database');

class ActivityLog {
  static async create(activityData) {
    const pool = getPool();
    const { user_id, action, description, entity_type, entity_id, ip_address, user_agent } = activityData;

    const [result] = await pool.execute(
      'INSERT INTO activity_logs (user_id, action, description, entity_type, entity_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, action, description, entity_type, entity_id, ip_address, user_agent]
    );

    return result.insertId;
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, user_id, action, description, entity_type, entity_id, ip_address, created_at FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows;
  }

  static async findAll(limit = 100, offset = 0) {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT al.id, al.user_id, al.action, al.description, al.entity_type, al.entity_id, al.ip_address, al.created_at, u.username, u.full_name FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  static async getUserActivitySummary(userId) {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT action, COUNT(*) as count, MAX(created_at) as last_activity FROM activity_logs WHERE user_id = ? GROUP BY action ORDER BY last_activity DESC',
      [userId]
    );
    return rows;
  }

  static async deleteOldLogs(days = 90) {
    const pool = getPool();
    const [result] = await pool.execute(
      'DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    );
    return result.affectedRows;
  }
}

module.exports = ActivityLog;