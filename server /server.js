const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('/tmp/inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTables();
  }
});

// Create tables
function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      currentStock REAL NOT NULL,
      minStock REAL NOT NULL,
      unitCost REAL NOT NULL,
      totalValue REAL NOT NULL,
      lastUpdated TEXT NOT NULL,
      status TEXT NOT NULL,
      barcode TEXT,
      unit TEXT NOT NULL,
      expiryDate TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating inventory table:', err.message);
    } else {
      console.log('Inventory table created or already exists.');
    }
  });
}

// Routes

// Get all inventory items
app.get('/api/inventory', (req, res) => {
  db.all('SELECT * FROM inventory', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single inventory item
app.get('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM inventory WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

// Add new inventory item
app.post('/api/inventory', (req, res) => {
  const { name, category, currentStock, minStock, unitCost, barcode, unit, expiryDate } = req.body;
  const totalValue = currentStock * unitCost;
  const lastUpdated = new Date().toLocaleString();
  const status = currentStock > minStock ? 'in_stock' : 'low_stock';

  db.run(`
    INSERT INTO inventory (name, category, currentStock, minStock, unitCost, totalValue, lastUpdated, status, barcode, unit, expiryDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, category, currentStock, minStock, unitCost, totalValue, lastUpdated, status, barcode, unit, expiryDate], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Item added successfully' });
  });
});

// Update inventory item
app.put('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, currentStock, minStock, unitCost, barcode, unit, expiryDate } = req.body;
  const totalValue = currentStock * unitCost;
  const lastUpdated = new Date().toLocaleString();
  const status = currentStock > minStock ? 'in_stock' : currentStock === 0 ? 'out_of_stock' : 'low_stock';

  db.run(`
    UPDATE inventory
    SET name = ?, category = ?, currentStock = ?, minStock = ?, unitCost = ?, totalValue = ?, lastUpdated = ?, status = ?, barcode = ?, unit = ?, expiryDate = ?
    WHERE id = ?
  `, [name, category, currentStock, minStock, unitCost, totalValue, lastUpdated, status, barcode, unit, expiryDate, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes > 0) {
      res.json({ message: 'Item updated successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

// Update stock (adjustment)
app.patch('/api/inventory/:id/stock', (req, res) => {
  const { id } = req.params;
  const { adjustment } = req.body;

  db.get('SELECT currentStock, minStock, unitCost FROM inventory WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const newStock = row.currentStock + parseFloat(adjustment);
    const totalValue = newStock * row.unitCost;
    const lastUpdated = new Date().toLocaleString();
    const status = newStock > row.minStock ? 'in_stock' : newStock === 0 ? 'out_of_stock' : 'low_stock';

    db.run(`
      UPDATE inventory
      SET currentStock = ?, totalValue = ?, lastUpdated = ?, status = ?
      WHERE id = ?
    `, [newStock, totalValue, lastUpdated, status, id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Stock updated successfully' });
    });
  });
});

// Delete inventory item
app.delete('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM inventory WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes > 0) {
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});