This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
public/
  vite.svg
server /
  package.json
  server.js
src/
  assets/
    react.svg
  components/
    Customers.tsx
    Dashboard.tsx
    Header.tsx
    Inventory.tsx
    Labels.tsx
    Orders.tsx
    POS.tsx
    Products.tsx
    Sidebar.tsx
    Suppliers.tsx
    Users.tsx
  App.css
  App.tsx
  index.css
  main.tsx
  vite-env.d.ts
.gitignore
.repomixignore
eslint.config.js
index.html
package.json
README.md
repomix.config.json
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: public/vite.svg
````
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
````

## File: server /package.json
````json
{
  "name": "pos-backend",
  "version": "1.0.0",
  "description": "Backend for POS system",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
````

## File: server /server.js
````javascript
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
````

## File: src/assets/react.svg
````
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
````

## File: src/components/Customers.tsx
````typescript
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  People as PeopleIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  customerId?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder?: string;
}

const Customers: React.FC = () => {
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john@example.com',
      customerId: 'CUST001',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      notes: 'Regular customer',
      totalOrders: 5,
      totalSpent: 250.00,
      lastOrder: '2024-12-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    customerId: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCustomer = () => {
    console.log('Adding customer:', customerForm);
    setShowAddModal(false);
    resetCustomerForm();
  };

  const handleEditCustomer = () => {
    console.log('Editing customer:', editingCustomer?.id, customerForm);
    setShowEditModal(false);
    resetCustomerForm();
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      console.log('Deleting customer:', customerId);
    }
  };

  const handleViewHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowHistoryModal(true);
  };

  const resetCustomerForm = () => {
    setCustomerForm({
      name: '',
      phone: '',
      email: '',
      customerId: '',
      address: '',
      city: '',
      postalCode: '',
      notes: ''
    });
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      customerId: customer.customerId || '',
      address: customer.address || '',
      city: customer.city || '',
      postalCode: customer.postalCode || '',
      notes: customer.notes || ''
    });
    setShowEditModal(true);
  };

  const generateCustomerId = () => {
    const customerId = 'CUST' + Date.now().toString().slice(-6);
    setCustomerForm({ ...customerForm, customerId });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Customer Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
          Add Customer
        </Button>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 300px' } }}>
              <TextField
                fullWidth
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
              <Button variant="outlined" startIcon={<DownloadIcon />} fullWidth>
                Export
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Total Orders</TableCell>
                  <TableCell>Total Spent</TableCell>
                  <TableCell>Last Order</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                      <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No Customers Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Start by adding your first customer
                      </Typography>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
                        Add Customer
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {customer.name}
                          </Typography>
                          {customer.customerId && (
                            <Typography variant="body2" color="text.secondary">
                              ID: {customer.customerId}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.email || '-'}</TableCell>
                      <TableCell>
                        {customer.address ? (
                          <Box>
                            <Typography variant="body2">{customer.address}</Typography>
                            {customer.city && (
                              <Typography variant="body2" color="text.secondary">
                                {customer.city}{customer.postalCode ? `, ${customer.postalCode}` : ''}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.totalOrders}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>{customer.lastOrder || '-'}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => openEditModal(customer)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleViewHistory(customer)}>
                          <HistoryIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteCustomer(customer.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={customerForm.name}
              onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={customerForm.email}
              onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Customer ID"
                value={customerForm.customerId}
                onChange={(e) => setCustomerForm({ ...customerForm, customerId: e.target.value })}
                placeholder="Auto-generated if empty"
              />
              <Button variant="outlined" onClick={generateCustomerId}>
                Generate
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Address"
              value={customerForm.address}
              onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
              placeholder="Street address"
            />
            <TextField
              fullWidth
              label="City"
              value={customerForm.city}
              onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
            />
            <TextField
              fullWidth
              label="Postal Code"
              value={customerForm.postalCode}
              onChange={(e) => setCustomerForm({ ...customerForm, postalCode: e.target.value })}
            />
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={customerForm.notes}
                onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                placeholder="Additional notes about the customer"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddCustomer} variant="contained">Add Customer</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={customerForm.name}
              onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={customerForm.email}
              onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Customer ID"
              value={customerForm.customerId}
              onChange={(e) => setCustomerForm({ ...customerForm, customerId: e.target.value })}
            />
            <TextField
              fullWidth
              label="Address"
              value={customerForm.address}
              onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
            />
            <TextField
              fullWidth
              label="City"
              value={customerForm.city}
              onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
            />
            <TextField
              fullWidth
              label="Postal Code"
              value={customerForm.postalCode}
              onChange={(e) => setCustomerForm({ ...customerForm, postalCode: e.target.value })}
            />
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={customerForm.notes}
                onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditCustomer} variant="contained">Update Customer</Button>
        </DialogActions>
      </Dialog>

      {/* Customer History Modal */}
      <Dialog open={showHistoryModal} onClose={() => setShowHistoryModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Customer Purchase History</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Orders
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>#ORD001</TableCell>
                        <TableCell>Dec 15, 2024</TableCell>
                        <TableCell>3 items</TableCell>
                        <TableCell>$45.99</TableCell>
                        <TableCell>
                          <Chip label="Completed" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#ORD002</TableCell>
                        <TableCell>Dec 10, 2024</TableCell>
                        <TableCell>2 items</TableCell>
                        <TableCell>$28.50</TableCell>
                        <TableCell>
                          <Chip label="Completed" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Customer Summary
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                        {selectedCustomer.totalOrders}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Orders
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                        ${selectedCustomer.totalSpent.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Spent
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                        5 days
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Order
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
````

## File: src/components/Dashboard.tsx
````typescript
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const dashboardCards = [
    {
      title: "Today's Sales",
      value: '$0.00',
      change: '+0.0% from yesterday',
      icon: <ShoppingCartIcon sx={{ fontSize: 32, color: 'white' }} />,
      bgColor: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
    {
      title: 'Total Products',
      value: '0',
      change: '+0 new this month',
      icon: <CategoryIcon sx={{ fontSize: 32, color: 'white' }} />,
      bgColor: 'linear-gradient(135deg, #34d399, #10b981)',
    },
    {
      title: 'Total Customers',
      value: '0',
      change: '+0 this week',
      icon: <PeopleIcon sx={{ fontSize: 32, color: 'white' }} />,
      bgColor: 'linear-gradient(135deg, #f97316, #ea580c)',
    },
    {
      title: 'Profit Margin',
      value: '0.0%',
      change: '+0.0% from last month',
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: 'white' }} />,
      bgColor: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Products',
      description: 'Add, edit, and manage your inventory',
      icon: <AddIcon sx={{ fontSize: 24, color: '#2563eb' }} />,
      action: () => console.log('Navigate to products'),
    },
    {
      title: 'Customer Management',
      description: 'Add and manage customer information',
      icon: <PeopleIcon sx={{ fontSize: 24, color: '#10b981' }} />,
      action: () => console.log('Navigate to customers'),
    },
    {
      title: 'View Orders',
      description: 'Track pending and completed orders',
      icon: <ViewListIcon sx={{ fontSize: 24, color: '#f97316' }} />,
      action: () => console.log('Navigate to orders'),
    },
    {
      title: 'Inventory Status',
      description: 'Check stock levels and alerts',
      icon: <InventoryIcon sx={{ fontSize: 24, color: '#7c3aed' }} />,
      action: () => console.log('Navigate to inventory'),
    },
  ];

  const reports = [
    {
      title: 'Daily Sales Report',
      description: 'Generate today\'s sales summary',
      icon: <ReceiptIcon sx={{ fontSize: 24, color: '#2563eb' }} />,
      action: () => console.log('Generate daily report'),
    },
    {
      title: 'Monthly Report',
      description: 'View this month\'s performance',
      icon: <DashboardIcon sx={{ fontSize: 24, color: '#10b981' }} />,
      action: () => console.log('Generate monthly report'),
    },
    {
      title: 'Inventory Report',
      description: 'Stock levels and movements',
      icon: <InventoryIcon sx={{ fontSize: 24, color: '#f97316' }} />,
      action: () => console.log('Generate inventory report'),
    },
    {
      title: 'Customer Report',
      description: 'Customer purchase history',
      icon: <PeopleIcon sx={{ fontSize: 24, color: '#7c3aed' }} />,
      action: () => console.log('Generate customer report'),
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Page Title */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Dashboard Overview
        </Typography>
      </Box>

      {/* Dashboard Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              background: card.bgColor,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 500, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '32px', fontWeight: 800, mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {card.change}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Quick Actions
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            sx={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669, #10b981)',
              },
            }}
          >
            Open POS
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
          {quickActions.map((action, index) => (
            <Card
              key={index}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
              onClick={action.action}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(37, 99, 235, 0.1)',
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {action.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Reports Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Reports & Analytics
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
          {reports.map((report, index) => (
            <Card
              key={index}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
              onClick={report.action}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(37, 99, 235, 0.1)',
                    }}
                  >
                    {report.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {report.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {report.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Recent Activity */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Sales
                </Typography>
                <Button size="small" sx={{ color: 'primary.main' }}>
                  View All
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                      <ReceiptIcon sx={{ fontSize: 32, mb: 1, color: 'text.secondary' }} />
                      <Typography>No recent sales</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Low Stock Alerts
                </Typography>
                <Button size="small" sx={{ color: 'warning.main' }}>
                  View All
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Current Stock</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Min. Stock</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                      <CheckCircleIcon sx={{ fontSize: 32, mb: 1, color: 'success.main' }} />
                      <Typography>All products in stock</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
````

## File: src/components/Header.tsx
````typescript
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Get UTC time by adjusting for local timezone offset
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      // Adjust for Asia/Colombo timezone (UTC+5:30)
      const colomboOffset = 5.5 * 60 * 60000; // 5.5 hours in milliseconds
      const colomboTime = new Date(utc + colomboOffset);
      const dateStr = colomboTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = colomboTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(`${dateStr} | ${timeStr}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    // Implement search functionality here
    console.log('Searching for:', term);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 3 }}>
      {/* Search Bar */}
      <TextField
        placeholder="Search products, customers..."
        value={searchTerm}
        onChange={handleSearch}
        variant="outlined"
        size="small"
        sx={{
          flex: 1,
          maxWidth: 320,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: 3,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* DateTime Display */}
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '16px',
          }}
        >
          {currentTime}
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            User
          </Typography>
          <Chip
            label="Staff"
            size="small"
            sx={{
              fontSize: '11px',
              height: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
          />
        </Box>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            fontWeight: 700,
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          U
        </Avatar>
      </Box>
    </Box>
  );
};

export default Header;
````

## File: src/components/Inventory.tsx
````typescript
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitCost: number;
  totalValue: number;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired' | 'damaged';
  barcode?: string;
  unit: string;
  expiryDate?: string;
}

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showDamagedModal, setShowDamagedModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form states
  const [updateForm, setUpdateForm] = useState({
    adjustment: '',
    reason: 'purchase',
    notes: ''
  });

  const [expiredForm, setExpiredForm] = useState({
    expiryDate: '',
    quantity: '',
    reason: 'expired',
    notes: ''
  });

  const [damagedForm, setDamagedForm] = useState({
    quantity: '',
    reason: 'physical_damage',
    notes: ''
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [addProductForm, setAddProductForm] = useState({
    name: '',
    category: '',
    currentStock: '',
    unit: 'pieces',
    minStock: '',
    unitCost: '',
    expiryDate: ''
  });

  // Fetch inventory from backend
  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      } else {
        console.error('Failed to fetch inventory');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStock = !stockFilter || item.status === stockFilter;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const summaryStats = {
    totalProducts: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
    lowStockItems: inventory.filter(item => item.status === 'low_stock').length,
    outOfStockItems: inventory.filter(item => item.status === 'out_of_stock').length
  };

  const handleUpdateStock = async () => {
    if (!selectedItem) return;
    try {
      const response = await fetch(`http://localhost:3001/api/inventory/${selectedItem.id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adjustment: parseFloat(updateForm.adjustment) || 0,
        }),
      });
      if (response.ok) {
        fetchInventory(); // Refresh the list
        setShowUpdateModal(false);
        resetUpdateForm();
      } else {
        console.error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleRemoveExpired = async () => {
    if (!selectedItem) return;
    try {
      const response = await fetch(`http://localhost:3001/api/inventory/${selectedItem.id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adjustment: -(parseFloat(expiredForm.quantity) || 0),
        }),
      });
      if (response.ok) {
        fetchInventory(); // Refresh the list
        setShowExpiredModal(false);
        resetExpiredForm();
      } else {
        console.error('Failed to remove expired stock');
      }
    } catch (error) {
      console.error('Error removing expired stock:', error);
    }
  };

  const handleRemoveDamaged = async () => {
    if (!selectedItem) return;
    try {
      const response = await fetch(`http://localhost:3001/api/inventory/${selectedItem.id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adjustment: -(parseFloat(damagedForm.quantity) || 0),
        }),
      });
      if (response.ok) {
        fetchInventory(); // Refresh the list
        setShowDamagedModal(false);
        resetDamagedForm();
      } else {
        console.error('Failed to remove damaged stock');
      }
    } catch (error) {
      console.error('Error removing damaged stock:', error);
    }
  };

  const resetUpdateForm = () => {
    setUpdateForm({ adjustment: '', reason: 'purchase', notes: '' });
  };

  const resetExpiredForm = () => {
    setExpiredForm({ expiryDate: '', quantity: '', reason: 'expired', notes: '' });
  };

  const resetDamagedForm = () => {
    setDamagedForm({ quantity: '', reason: 'physical_damage', notes: '' });
  };

  const resetAddProductForm = () => {
    setAddProductForm({
      name: '',
      category: '',
      currentStock: '',
      unit: 'pieces',
      minStock: '',
      unitCost: '',
      expiryDate: ''
    });
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: addProductForm.name,
          category: addProductForm.category,
          currentStock: parseFloat(addProductForm.currentStock) || 0,
          minStock: parseFloat(addProductForm.minStock) || 0,
          unitCost: parseFloat(addProductForm.unitCost) || 0,
          barcode: '', // optional
          unit: addProductForm.unit,
          expiryDate: addProductForm.expiryDate || null
        }),
      });
      if (response.ok) {
        fetchInventory(); // Refresh the list
        setShowAddModal(false);
        resetAddProductForm();
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const openUpdateModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowUpdateModal(true);
  };

  const openExpiredModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowExpiredModal(true);
  };

  const openDamagedModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDamagedModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'error';
      case 'expired': return 'error';
      case 'damaged': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      case 'expired': return 'Expired';
      case 'damaged': return 'Damaged';
      default: return status;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Inventory Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
            Add Product
          </Button>
          <Button variant="outlined" startIcon={<AssessmentIcon />}>
            Generate Report
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Total Products
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.totalProducts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active products in inventory
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Total Stock Value
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              ${summaryStats.totalValue.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current inventory value
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Low Stock Items
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.lowStockItems}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Items below minimum stock
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ErrorIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Out of Stock
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.outOfStockItems}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Items with zero stock
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 300px' } }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
              <FormControl fullWidth>
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  label="Stock Status"
                >
                  <MenuItem value="">All Stock Levels</MenuItem>
                  <MenuItem value="in_stock">In Stock</MenuItem>
                  <MenuItem value="low_stock">Low Stock</MenuItem>
                  <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                  <MenuItem value="damaged">Damaged</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Min. Stock</TableCell>
                  <TableCell>Unit Cost</TableCell>
                  <TableCell>Total Value</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ textAlign: 'center', py: 6 }}>
                      <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No Inventory Items Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add products to start tracking inventory
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          {item.barcode && (
                            <Typography variant="body2" color="text.secondary">
                              Barcode: {item.barcode}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.minStock}</TableCell>
                      <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                      <TableCell>${item.totalValue.toFixed(2)}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell>{item.expiryDate || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(item.status)}
                          color={getStatusColor(item.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => openUpdateModal(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => openExpiredModal(item)}>
                          <ErrorIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => openDamagedModal(item)}>
                          <WarningIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Update Stock Modal */}
      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Stock</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedItem?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current Stock: {selectedItem?.currentStock} units
            </Typography>

            <TextField
              fullWidth
              label="Stock Adjustment"
              type="number"
              value={updateForm.adjustment}
              onChange={(e) => setUpdateForm({ ...updateForm, adjustment: e.target.value })}
              helperText="Use positive numbers to add stock, negative to remove"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reason</InputLabel>
              <Select
                value={updateForm.reason}
                onChange={(e) => setUpdateForm({ ...updateForm, reason: e.target.value })}
                label="Reason"
              >
                <MenuItem value="purchase">Purchase/Restock</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="damage">Damage/Loss</MenuItem>
                <MenuItem value="return">Return</MenuItem>
                <MenuItem value="correction">Stock Correction</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={updateForm.notes}
              onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
              placeholder="Additional notes"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateModal(false)}>Cancel</Button>
          <Button onClick={handleUpdateStock} variant="contained">Update Stock</Button>
        </DialogActions>
      </Dialog>

      {/* Remove Expired Modal */}
      <Dialog open={showExpiredModal} onClose={() => setShowExpiredModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Remove Expired Product</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedItem?.name}
            </Typography>

            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={expiredForm.expiryDate}
              onChange={(e) => setExpiredForm({ ...expiredForm, expiryDate: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Quantity to Remove"
              type="number"
              value={expiredForm.quantity}
              onChange={(e) => setExpiredForm({ ...expiredForm, quantity: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reason</InputLabel>
              <Select
                value={expiredForm.reason}
                onChange={(e) => setExpiredForm({ ...expiredForm, reason: e.target.value })}
                label="Reason"
              >
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="near_expiry">Near Expiry</MenuItem>
                <MenuItem value="quality_issue">Quality Issue</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={expiredForm.notes}
              onChange={(e) => setExpiredForm({ ...expiredForm, notes: e.target.value })}
              placeholder="Additional notes about removal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExpiredModal(false)}>Cancel</Button>
          <Button onClick={handleRemoveExpired} variant="contained" color="error">Remove Product</Button>
        </DialogActions>
      </Dialog>

      {/* Remove Damaged Modal */}
      <Dialog open={showDamagedModal} onClose={() => setShowDamagedModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Remove Damaged Product</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedItem?.name}
            </Typography>

            <TextField
              fullWidth
              label="Quantity to Remove"
              type="number"
              value={damagedForm.quantity}
              onChange={(e) => setDamagedForm({ ...damagedForm, quantity: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reason</InputLabel>
              <Select
                value={damagedForm.reason}
                onChange={(e) => setDamagedForm({ ...damagedForm, reason: e.target.value })}
                label="Reason"
              >
                <MenuItem value="physical_damage">Physical Damage</MenuItem>
                <MenuItem value="water_damage">Water Damage</MenuItem>
                <MenuItem value="contamination">Contamination</MenuItem>
                <MenuItem value="theft">Theft/Loss</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={damagedForm.notes}
              onChange={(e) => setDamagedForm({ ...damagedForm, notes: e.target.value })}
              placeholder="Describe the damage"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDamagedModal(false)}>Cancel</Button>
          <Button onClick={handleRemoveDamaged} variant="contained" color="warning">Remove Product</Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={addProductForm.name}
              onChange={(e) => setAddProductForm({ ...addProductForm, name: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={addProductForm.category}
                onChange={(e) => setAddProductForm({ ...addProductForm, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Beverages">Beverages</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={addProductForm.currentStock}
                onChange={(e) => setAddProductForm({ ...addProductForm, currentStock: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={addProductForm.unit}
                  onChange={(e) => setAddProductForm({ ...addProductForm, unit: e.target.value })}
                  label="Unit"
                >
                  <MenuItem value="pieces">Pieces</MenuItem>
                  <MenuItem value="kg">Kg</MenuItem>
                  <MenuItem value="g">G</MenuItem>
                  <MenuItem value="liter">Liter</MenuItem>
                  <MenuItem value="ml">Ml</MenuItem>
                  <MenuItem value="bottles">Bottles</MenuItem>
                  <MenuItem value="pack">Pack</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Minimum Stock"
              type="number"
              value={addProductForm.minStock}
              onChange={(e) => setAddProductForm({ ...addProductForm, minStock: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Unit Cost"
              type="number"
              value={addProductForm.unitCost}
              onChange={(e) => setAddProductForm({ ...addProductForm, unitCost: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Expiry Date (Optional)"
              type="date"
              value={addProductForm.expiryDate}
              onChange={(e) => setAddProductForm({ ...addProductForm, expiryDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} variant="contained">Add Product</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
````

## File: src/components/Labels.tsx
````typescript
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Tag as TagIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

interface LabelTemplate {
  id: string;
  name: string;
  size: string;
  description?: string;
  fields: string[];
  fontSize: string;
  orientation: string;
}

interface LabelGeneration {
  id: string;
  date: string;
  template: string;
  products: number;
  labelsGenerated: number;
  status: 'completed' | 'pending' | 'failed';
}

const Labels: React.FC = () => {
  const [templates] = useState<LabelTemplate[]>([
    {
      id: '1',
      name: 'Standard Label',
      size: '2.25x1.25',
      description: 'Standard product label',
      fields: ['name', 'price', 'barcode'],
      fontSize: 'medium',
      orientation: 'portrait'
    }
  ]);

  const [recentGenerations] = useState<LabelGeneration[]>([
    {
      id: '1',
      date: '2024-12-15',
      template: 'Standard Label',
      products: 5,
      labelsGenerated: 25,
      status: 'completed'
    }
  ]);

  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showGenerateLabels, setShowGenerateLabels] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LabelTemplate | null>(null);

  // Form states
  const [templateForm, setTemplateForm] = useState({
    name: '',
    size: '2.25x1.25',
    description: '',
    fields: ['name', 'price', 'barcode'],
    fontSize: 'medium',
    orientation: 'portrait'
  });

  const [generateForm, setGenerateForm] = useState({
    templateId: '',
    products: [] as string[],
    quantityPerProduct: 1,
    format: 'pdf',
    includeBarcode: true
  });

  const summaryStats = {
    availableTemplates: templates.length,
    productsWithLabels: 0, // Would be calculated from products
    labelsPrintedToday: recentGenerations
      .filter(gen => gen.date === new Date().toISOString().split('T')[0])
      .reduce((sum, gen) => sum + gen.labelsGenerated, 0),
    totalLabelsPrinted: recentGenerations.reduce((sum, gen) => sum + gen.labelsGenerated, 0)
  };

  const handleCreateTemplate = () => {
    console.log('Creating template:', templateForm);
    setShowCreateTemplate(false);
    resetTemplateForm();
  };

  const handleGenerateLabels = () => {
    console.log('Generating labels:', generateForm);
    setShowGenerateLabels(false);
    resetGenerateForm();
  };

  const handlePreviewTemplate = (template: LabelTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleEditTemplate = (templateId: string) => {
    console.log('Editing template:', templateId);
    alert('Template editing would be implemented here');
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      console.log('Deleting template:', templateId);
    }
  };

  const handleViewLabels = (generationId: string) => {
    console.log('Viewing labels for generation:', generationId);
    alert('Label viewing would be implemented here');
  };

  const handlePrintLabels = (generationId: string) => {
    console.log('Printing labels for generation:', generationId);
    alert('Print functionality would be implemented here');
  };

  const handleDownloadLabels = (generationId: string) => {
    console.log('Downloading labels for generation:', generationId);
    alert('Download functionality would be implemented here');
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      size: '2.25x1.25',
      description: '',
      fields: ['name', 'price', 'barcode'],
      fontSize: 'medium',
      orientation: 'portrait'
    });
  };

  const resetGenerateForm = () => {
    setGenerateForm({
      templateId: '',
      products: [],
      quantityPerProduct: 1,
      format: 'pdf',
      includeBarcode: true
    });
  };

  const handleFieldChange = (field: string, checked: boolean) => {
    setTemplateForm(prev => ({
      ...prev,
      fields: checked
        ? [...prev.fields, field]
        : prev.fields.filter(f => f !== field)
    }));
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    setGenerateForm(prev => ({
      ...prev,
      products: checked
        ? [...prev.products, productId]
        : prev.products.filter(p => p !== productId)
    }));
  };

  const handleSelectAllProducts = (checked: boolean) => {
    // In a real app, this would get all product IDs
    const allProductIds = ['1', '2', '3']; // Mock data
    setGenerateForm(prev => ({
      ...prev,
      products: checked ? allProductIds : []
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case '2.25x1.25': return '2.25" x 1.25" (Standard)';
      case '3x1': return '3" x 1" (Large)';
      case '4x2': return '4" x 2" (Extra Large)';
      case '1.5x1': return '1.5" x 1" (Small)';
      default: return size;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Label Printing Tool
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowCreateTemplate(true)}>
            New Template
          </Button>
          <Button variant="contained" startIcon={<TagIcon />} onClick={() => setShowGenerateLabels(true)}>
            Generate Labels
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Available Templates
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.availableTemplates}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Label templates
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InventoryIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Products with Labels
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.productsWithLabels}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Products available
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PrintIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Labels Printed Today
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.labelsPrintedToday}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Labels printed
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssessmentIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Total Labels Printed
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.totalLabelsPrinted}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All time total
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Label Templates Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Label Templates
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {templates.length === 0 ? (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6 }}>
              <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Templates Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create your first label template
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateTemplate(true)}>
                Create Template
              </Button>
            </Box>
          ) : (
            templates.map((template) => (
              <Card key={template.id} sx={{ cursor: 'pointer' }} onClick={() => handlePreviewTemplate(template)}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {getSizeLabel(template.size)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.fields.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditTemplate(template.id); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>

      {/* Recent Labels Section */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Recent Label Generations
        </Typography>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Template</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Labels Generated</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentGenerations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                        <TagIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No Recent Labels
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Generated labels will appear here
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentGenerations.map((generation) => (
                      <TableRow key={generation.id}>
                        <TableCell>{generation.date}</TableCell>
                        <TableCell>{generation.template}</TableCell>
                        <TableCell>{generation.products}</TableCell>
                        <TableCell>{generation.labelsGenerated}</TableCell>
                        <TableCell>
                          <Chip
                            label={generation.status}
                            color={getStatusColor(generation.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleViewLabels(generation.id)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handlePrintLabels(generation.id)}>
                            <PrintIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDownloadLabels(generation.id)}>
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Create Template Modal */}
      <Dialog open={showCreateTemplate} onClose={() => setShowCreateTemplate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Label Template</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Template Name"
              value={templateForm.name}
              onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Label Size</InputLabel>
              <Select
                value={templateForm.size}
                onChange={(e) => setTemplateForm({ ...templateForm, size: e.target.value })}
                label="Label Size"
              >
                <MenuItem value="2.25x1.25">2.25" x 1.25" (Standard)</MenuItem>
                <MenuItem value="3x1">3" x 1" (Large)</MenuItem>
                <MenuItem value="4x2">4" x 2" (Extra Large)</MenuItem>
                <MenuItem value="1.5x1">1.5" x 1" (Small)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={templateForm.description}
              onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
              placeholder="Describe this template"
            />
            <FormControl fullWidth>
              <InputLabel>Font Size</InputLabel>
              <Select
                value={templateForm.fontSize}
                onChange={(e) => setTemplateForm({ ...templateForm, fontSize: e.target.value })}
                label="Font Size"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Orientation</InputLabel>
              <Select
                value={templateForm.orientation}
                onChange={(e) => setTemplateForm({ ...templateForm, orientation: e.target.value })}
                label="Orientation"
              >
                <MenuItem value="portrait">Portrait</MenuItem>
                <MenuItem value="landscape">Landscape</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Include Fields</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1 }}>
                {[
                  { value: 'name', label: 'Product Name' },
                  { value: 'price', label: 'Price' },
                  { value: 'barcode', label: 'Barcode' },
                  { value: 'sku', label: 'SKU' },
                  { value: 'category', label: 'Category' },
                  { value: 'brand', label: 'Brand' }
                ].map((field) => (
                  <FormControlLabel
                    key={field.value}
                    control={
                      <Checkbox
                        checked={templateForm.fields.includes(field.value)}
                        onChange={(e) => handleFieldChange(field.value, e.target.checked)}
                      />
                    }
                    label={field.label}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateTemplate(false)}>Cancel</Button>
          <Button onClick={handleCreateTemplate} variant="contained">Save Template</Button>
        </DialogActions>
      </Dialog>

      {/* Generate Labels Modal */}
      <Dialog open={showGenerateLabels} onClose={() => setShowGenerateLabels(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Generate Product Labels</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Select Template</InputLabel>
              <Select
                value={generateForm.templateId}
                onChange={(e) => setGenerateForm({ ...generateForm, templateId: e.target.value })}
                label="Select Template"
                required
              >
                <MenuItem value="">Choose a template</MenuItem>
                {templates.map(template => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name} - {getSizeLabel(template.size)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Labels per Product"
              type="number"
              value={generateForm.quantityPerProduct}
              onChange={(e) => setGenerateForm({ ...generateForm, quantityPerProduct: parseInt(e.target.value) })}
              inputProps={{ min: 1, max: 10 }}
            />
            <FormControl fullWidth>
              <InputLabel>Output Format</InputLabel>
              <Select
                value={generateForm.format}
                onChange={(e) => setGenerateForm({ ...generateForm, format: e.target.value })}
                label="Output Format"
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="png">PNG Images</MenuItem>
                <MenuItem value="jpg">JPG Images</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generateForm.includeBarcode}
                    onChange={(e) => setGenerateForm({ ...generateForm, includeBarcode: e.target.checked })}
                  />
                }
                label="Include barcode on labels"
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Select Products</Typography>
              <Box sx={{ border: '1px solid #e9ecef', borderRadius: 1, p: 2, maxHeight: 200, overflowY: 'auto' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={generateForm.products.length === 3} // Mock: assuming 3 products
                      onChange={(e) => handleSelectAllProducts(e.target.checked)}
                    />
                  }
                  label={<strong>Select All Products</strong>}
                  sx={{ mb: 1 }}
                />
                {[
                  { id: '1', name: 'Sample Product 1', stock: 50 },
                  { id: '2', name: 'Sample Product 2', stock: 30 },
                  { id: '3', name: 'Sample Product 3', stock: 100 }
                ].map((product) => (
                  <FormControlLabel
                    key={product.id}
                    control={
                      <Checkbox
                        checked={generateForm.products.includes(product.id)}
                        onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                      />
                    }
                    label={`${product.name} (Stock: ${product.stock})`}
                    sx={{ display: 'block', ml: 2 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGenerateLabels(false)}>Cancel</Button>
          <Button onClick={handleGenerateLabels} variant="contained">Generate Labels</Button>
        </DialogActions>
      </Dialog>

      {/* Label Preview Modal */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Label Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {selectedTemplate && (
              <Box
                sx={{
                  background: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: 1,
                  p: 2,
                  display: 'inline-block',
                  textAlign: 'center'
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  Product Name
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Category
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  $99.99
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '10px' }}>
                  BARCODE123
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Template: {selectedTemplate?.name} | Size: {getSizeLabel(selectedTemplate?.size || '')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Labels;
````

## File: src/components/Orders.tsx
````typescript
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  ShoppingCart as ShoppingCartIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  orderTime: string;
  status: 'pending' | 'holding' | 'completed';
  paymentMethod?: string;
}

const Orders: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD001',
      customer: 'John Doe',
      items: 3,
      total: 45.99,
      orderTime: '2024-12-15 14:30',
      status: 'completed',
      paymentMethod: 'Cash'
    }
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form states
  const [cancelForm, setCancelForm] = useState({
    reason: '',
    notes: ''
  });

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const holdingOrders = orders.filter(order => order.status === 'holding');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const summaryStats = {
    pending: pendingOrders.length,
    holding: holdingOrders.length,
    completedToday: completedOrders.filter(order =>
      new Date(order.orderTime).toDateString() === new Date().toDateString()
    ).length,
    totalRevenue: orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0)
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCompleteOrder = (orderId: string) => {
    if (window.confirm('Mark this order as completed?')) {
      console.log('Completing order:', orderId);
    }
  };

  const handleHoldOrder = (orderId: string) => {
    if (window.confirm('Put this order on hold?')) {
      console.log('Holding order:', orderId);
    }
  };

  const handleResumeOrder = (orderId: string) => {
    if (window.confirm('Resume this order?')) {
      console.log('Resuming order:', orderId);
    }
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (selectedOrder) {
      console.log('Cancelling order:', selectedOrder.id, cancelForm);
      setShowCancelModal(false);
      setCancelForm({ reason: '', notes: '' });
    }
  };

  const handlePrintBill = (orderId: string) => {
    console.log('Printing bill for order:', orderId);
    alert('Print functionality would be implemented here');
  };

  const handleEmailReceipt = (orderId: string) => {
    const email = prompt('Enter customer email address:');
    if (email) {
      console.log('Emailing receipt to:', email, 'for order:', orderId);
      alert('Receipt sent successfully!');
    }
  };

  const handleGenerateReport = () => {
    console.log('Generating orders report');
    alert('Report generation would be implemented here');
  };

  const handleExportOrders = () => {
    console.log('Exporting orders data');
    alert('Export functionality would be implemented here');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'holding': return 'secondary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'holding': return 'Holding';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const renderOrderTable = (orders: Order[], showActions: boolean = true) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>{activeTab === 2 ? 'Completed Time' : activeTab === 1 ? 'Held Time' : 'Order Time'}</TableCell>
            {activeTab === 2 && <TableCell>Payment</TableCell>}
            {showActions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? (activeTab === 2 ? 7 : 6) : (activeTab === 2 ? 6 : 5)} sx={{ textAlign: 'center', py: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  {activeTab === 0 && <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
                  {activeTab === 1 && <PauseIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
                  {activeTab === 2 && <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />}
                  <Typography variant="h6" color="text.secondary">
                    {activeTab === 0 && 'No Pending Orders'}
                    {activeTab === 1 && 'No Holding Orders'}
                    {activeTab === 2 && 'No Completed Orders'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activeTab === 0 && 'All orders have been processed'}
                    {activeTab === 1 && 'No orders are currently on hold'}
                    {activeTab === 2 && 'Completed orders will appear here'}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.orderTime}</TableCell>
                {activeTab === 2 && <TableCell>{order.paymentMethod || '-'}</TableCell>}
                {showActions && (
                  <TableCell>
                    <IconButton size="small" onClick={() => handleViewDetails(order)}>
                      <VisibilityIcon />
                    </IconButton>
                    {activeTab === 0 && (
                      <>
                        <IconButton size="small" onClick={() => handleCompleteOrder(order.id)}>
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleHoldOrder(order.id)}>
                          <PauseIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleCancelOrder(order)}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                    {activeTab === 1 && (
                      <IconButton size="small" onClick={() => handleResumeOrder(order.id)}>
                        <PlayArrowIcon />
                      </IconButton>
                    )}
                    {activeTab === 2 && (
                      <>
                        <IconButton size="small" onClick={() => handlePrintBill(order.id)}>
                          <PrintIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEmailReceipt(order.id)}>
                          <EmailIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Order Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<AssessmentIcon />} onClick={handleGenerateReport}>
            Generate Report
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExportOrders}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Pending Orders
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Awaiting processing
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PauseIcon sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Holding Orders
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.holding}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Temporarily held
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Completed Today
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.completedToday}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Orders completed today
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Total Revenue
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              ${summaryStats.totalRevenue.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Today's revenue
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Order Tabs */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
            <Tab
              label={`Pending Orders (${summaryStats.pending})`}
              icon={<AccessTimeIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Holding Orders (${summaryStats.holding})`}
              icon={<PauseIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Completed Orders (${completedOrders.length})`}
              icon={<CheckCircleIcon />}
              iconPosition="start"
            />
          </Tabs>

          {activeTab === 0 && renderOrderTable(pendingOrders)}
          {activeTab === 1 && renderOrderTable(holdingOrders)}
          {activeTab === 2 && renderOrderTable(completedOrders)}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showDetailsModal} onClose={() => setShowDetailsModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>Order Information</Typography>
                    <Typography><strong>Order #:</strong> {selectedOrder.orderNumber}</Typography>
                    <Typography><strong>Customer:</strong> {selectedOrder.customer}</Typography>
                    <Typography><strong>Date:</strong> {selectedOrder.orderTime}</Typography>
                    <Typography><strong>Status:</strong>
                      <Chip
                        label={getStatusLabel(selectedOrder.status)}
                        color={getStatusColor(selectedOrder.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>Payment Information</Typography>
                    <Typography><strong>Payment:</strong> {selectedOrder.paymentMethod || 'N/A'}</Typography>
                    <Typography><strong>Subtotal:</strong> ${(selectedOrder.total * 0.92).toFixed(2)}</Typography>
                    <Typography><strong>Tax:</strong> ${(selectedOrder.total * 0.08).toFixed(2)}</Typography>
                    <Typography variant="h6"><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>Order Items</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Sample Product</TableCell>
                      <TableCell>{selectedOrder.items}</TableCell>
                      <TableCell>${(selectedOrder.total / selectedOrder.items).toFixed(2)}</TableCell>
                      <TableCell>${selectedOrder.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Order Modal */}
      <Dialog open={showCancelModal} onClose={() => setShowCancelModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order: {selectedOrder.orderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Customer: {selectedOrder.customer} | Total: ${selectedOrder.total.toFixed(2)}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Reason for Cancellation</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Customer Request', 'Payment Failed', 'Out of Stock', 'System Error', 'Other'].map((reason) => (
                    <Box key={reason} sx={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="radio"
                        name="cancelReason"
                        value={reason.toLowerCase().replace(' ', '_')}
                        onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                        style={{ marginRight: 8 }}
                      />
                      <Typography>{reason}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Additional Notes</Typography>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: 80,
                    padding: 8,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    fontFamily: 'inherit'
                  }}
                  placeholder="Optional notes about cancellation"
                  value={cancelForm.notes}
                  onChange={(e) => setCancelForm({ ...cancelForm, notes: e.target.value })}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelModal(false)}>Cancel</Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error">
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
````

## File: src/components/POS.tsx
````typescript
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as SwapHorizIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
}

const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Sample Product 1', price: 29.99, stock: 50, category: 'Electronics' },
    { id: '2', name: 'Sample Product 2', price: 19.99, stock: 30, category: 'Clothing' },
    { id: '3', name: 'Sample Product 3', price: 9.99, stock: 100, category: 'Food' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [customerSelect, setCustomerSelect] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('percent');
  const [showHeldSales, setShowHeldSales] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [returnReceiptNumber, setReturnReceiptNumber] = useState('');
  const [otherSubOption, setOtherSubOption] = useState('');

  // Initialize POS on mount
  useEffect(() => {
    initializePOS();
  }, []);

  const initializePOS = () => {
    // Ensure all elements properly fill their containers
    const containers = document.querySelectorAll('.table-container, .form-container, .card');
    containers.forEach(container => {
      (container as HTMLElement).style.width = '100%';
      (container as HTMLElement).style.maxWidth = '100%';
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === '' || product.category === categoryFilter)
  );

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = discountValue ? (discountType === 'percent' ? subtotal * (parseFloat(discountValue) / 100) : parseFloat(discountValue)) : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + tax;

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }];
      }
    });
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
      setDiscountValue('');
      setCashReceived('');
      setOtherSubOption('');
    }
  };

  const calculateChange = () => {
    const cash = parseFloat(cashReceived) || 0;
    const change = cash - total;
    return change >= 0 ? change : 0;
  };

  const processCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (paymentMethod === 'cash') {
      const cash = parseFloat(cashReceived) || 0;
      if (cash < total) {
        alert('Insufficient cash received!');
        return;
      }
    }

    if (window.confirm('Complete this sale?')) {
      // Process the sale
      console.log('Processing sale:', {
        items: cart,
        customer: customerSelect,
        paymentMethod,
        otherSubOption: paymentMethod === 'other' ? otherSubOption : null,
        discount: { type: discountType, value: discountValue },
        total
      });

      // Update product stock
      setProducts(prevProducts =>
        prevProducts.map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          if (cartItem) {
            return { ...product, stock: product.stock - cartItem.quantity };
          }
          return product;
        })
      );

      // Clear cart and reset
      setCart([]);
      setDiscountValue('');
      setCashReceived('');
      setCustomerSelect('');
      setOtherSubOption('');

      alert('Sale completed successfully!');
    }
  };

  const holdCurrentSale = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const holdData = {
      cart: [...cart],
      customer: customerSelect,
      discount: { type: discountType, value: discountValue },
      timestamp: new Date().toISOString()
    };

    // Save to localStorage for demo
    const heldSales = JSON.parse(localStorage.getItem('heldSales') || '[]');
    heldSales.push(holdData);
    localStorage.setItem('heldSales', JSON.stringify(heldSales));

    clearCart();
    alert('Sale held successfully!');
  };

  const showHeldSalesModal = () => {
    setShowHeldSales(true);
  };

  const showReturnsModal = () => {
    setShowReturns(true);
  };

  const loadReturnReceipt = () => {
    if (!returnReceiptNumber) {
      alert('Please enter a receipt number');
      return;
    }
    alert('Return functionality would be implemented here');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          Point of Sale
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<ReceiptIcon />} onClick={holdCurrentSale}>
            Hold Sale
          </Button>
          <Button variant="outlined" startIcon={<ReceiptIcon />} onClick={showHeldSalesModal}>
            Held Sales
          </Button>
          <Button variant="outlined" color="warning" startIcon={<SwapHorizIcon />} onClick={showReturnsModal}>
            Returns
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        {/* Products Section */}
        <Box sx={{ flex: 2 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              {/* Search and Filter */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                  fullWidth
                  placeholder="Search products or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <ReceiptIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>All Categories</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="All Categories"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Clothing">Clothing</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Products Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {filteredProducts.length === 0 ? (
                  <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6 }}>
                    <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No Products Available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Add products to start selling
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />}>
                      Add Products
                    </Button>
                  </Box>
                ) : (
                  filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                      }}
                      onClick={() => addToCart(product.id)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {product.category}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Stock: {product.stock}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Cart Section */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Current Sale</Typography>
                <IconButton onClick={clearCart} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* Customer Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Customer</InputLabel>
                <Select
                  value={customerSelect}
                  onChange={(e) => setCustomerSelect(e.target.value)}
                  label="Customer"
                >
                  <MenuItem value="">Walk-in Customer</MenuItem>
                  <MenuItem value="1">John Doe - 123-456-7890</MenuItem>
                  <MenuItem value="2">Jane Smith - 987-654-3210</MenuItem>
                </Select>
              </FormControl>

              {/* Cart Items */}
              <Box sx={{ mb: 2, maxHeight: 300, overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ShoppingCartIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Cart is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click on products to add them
                    </Typography>
                  </Box>
                ) : (
                  cart.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${item.price.toFixed(2)} each
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, -1)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography sx={{ ml: 2, fontWeight: 600 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>

              {/* Discount Section */}
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    sx={{ width: 80 }}
                  />
                  <Select
                    size="small"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    sx={{ width: 80 }}
                  >
                    <MenuItem value="percent">%</MenuItem>
                    <MenuItem value="amount">$</MenuItem>
                  </Select>
                  <Button size="small" variant="outlined">
                    Apply
                  </Button>
                </Box>
              </Box>

              {/* Cart Total */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>
                {discountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'error.main' }}>
                    <Typography>Discount</Typography>
                    <Typography>-${discountAmount.toFixed(2)}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax (8%)</Typography>
                  <Typography>${tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </Box>
              </Box>

              {/* Payment Methods */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Payment Method:</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  {[
                    { value: 'cash', label: 'Cash', icon: <WalletIcon /> },
                    { value: 'card', label: 'Card', icon: <CreditCardIcon /> },
                    { value: 'credit', label: 'Credit', icon: <PaymentIcon /> },
                    { value: 'mixed', label: 'Mixed', icon: <SwapHorizIcon /> },
                    { value: 'other', label: 'Other', icon: <HelpOutlineIcon /> },
                  ].map((method) => (
                    <Button
                      key={method.value}
                      variant={paymentMethod === method.value ? 'contained' : 'outlined'}
                      onClick={() => setPaymentMethod(method.value)}
                      startIcon={method.icon}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {method.label}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Other Payment Sub-options */}
              {paymentMethod === 'other' && (
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Other Payment Reason</InputLabel>
                    <Select
                      value={otherSubOption}
                      onChange={(e) => setOtherSubOption(e.target.value)}
                      label="Other Payment Reason"
                    >
                      <MenuItem value="expire">Expire</MenuItem>
                      <MenuItem value="owner_bearing">Owner Bearing</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Cash Payment Details */}
              {paymentMethod === 'cash' && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Cash Received"
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => setCashReceived(total.toFixed(2))}
                  >
                    Exact Amount
                  </Button>
                  {cashReceived && parseFloat(cashReceived) >= total && (
                    <Typography sx={{ mt: 1, color: 'success.main', textAlign: 'center' }}>
                      Change: ${(calculateChange()).toFixed(2)}
                    </Typography>
                  )}
                  {cashReceived && parseFloat(cashReceived) < total && (
                    <Typography sx={{ mt: 1, color: 'error.main', textAlign: 'center' }}>
                      Insufficient: ${(total - parseFloat(cashReceived)).toFixed(2)}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Checkout Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={processCheckout}
                disabled={cart.length === 0}
                sx={{ py: 1.5 }}
              >
                <ReceiptIcon sx={{ mr: 1 }} />
                Complete Checkout
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Held Sales Modal */}
      <Dialog open={showHeldSales} onClose={() => setShowHeldSales(false)} maxWidth="md" fullWidth>
        <DialogTitle>Held Sales</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            No held sales available
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHeldSales(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Returns Modal */}
      <Dialog open={showReturns} onClose={() => setShowReturns(false)} maxWidth="md" fullWidth>
        <DialogTitle>Sales Returns</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Receipt Number"
            value={returnReceiptNumber}
            onChange={(e) => setReturnReceiptNumber(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={loadReturnReceipt}>
            Load Receipt
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReturns(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default POS;
````

## File: src/components/Products.tsx
````typescript
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost_price: number;
  stock: number;
  min_stock: number;
  barcode?: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
}

const Products: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Sample Product',
      category: 'Electronics',
      price: 99.99,
      cost_price: 75.00,
      stock: 50,
      min_stock: 10,
      barcode: '123456789',
      description: 'Sample product description',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    barcode: '',
    category: '',
    supplier: '',
    price: '',
    cost_price: '',
    stock: '',
    min_stock: '5',
    description: ''
  });

  const [stockForm, setStockForm] = useState({
    adjustment: '',
    reason: 'purchase',
    notes: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStock = !stockFilter ||
      (stockFilter === 'in_stock' && product.stock > product.min_stock) ||
      (stockFilter === 'low_stock' && product.stock <= product.min_stock && product.stock > 0) ||
      (stockFilter === 'out_of_stock' && product.stock <= 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddProduct = () => {
    // Implementation for adding product
    console.log('Adding product:', productForm);
    setShowAddModal(false);
    resetProductForm();
  };

  const handleEditProduct = () => {
    // Implementation for editing product
    console.log('Editing product:', editingProduct?.id, productForm);
    setShowEditModal(false);
    resetProductForm();
  };

  const handleUpdateStock = () => {
    // Implementation for updating stock
    console.log('Updating stock for:', stockProduct?.id, stockForm);
    setShowStockModal(false);
    resetStockForm();
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Deleting product:', productId);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      barcode: '',
      category: '',
      supplier: '',
      price: '',
      cost_price: '',
      stock: '',
      min_stock: '5',
      description: ''
    });
  };

  const resetStockForm = () => {
    setStockForm({
      adjustment: '',
      reason: 'purchase',
      notes: ''
    });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      barcode: product.barcode || '',
      category: product.category,
      supplier: '', // Would need supplier data
      price: product.price.toString(),
      cost_price: product.cost_price.toString(),
      stock: product.stock.toString(),
      min_stock: product.min_stock.toString(),
      description: product.description || ''
    });
    setShowEditModal(true);
  };

  const openStockModal = (product: Product) => {
    setStockProduct(product);
    setShowStockModal(true);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) return { label: 'Out of Stock', color: 'error' as const };
    if (product.stock <= product.min_stock) return { label: 'Low Stock', color: 'warning' as const };
    return { label: 'In Stock', color: 'success' as const };
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Product Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
          Add Product
        </Button>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 300px' } }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
              <FormControl fullWidth>
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  label="Stock Status"
                >
                  <MenuItem value="">All Stock Levels</MenuItem>
                  <MenuItem value="in_stock">In Stock</MenuItem>
                  <MenuItem value="low_stock">Low Stock</MenuItem>
                  <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 150px' } }}>
              <Button variant="outlined" startIcon={<DownloadIcon />} fullWidth>
                Export
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Min. Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                      <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No Products Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Start by adding your first product
                      </Typography>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
                        Add Product
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {product.name}
                            </Typography>
                            {product.barcode && (
                              <Typography variant="body2" color="text.secondary">
                                Barcode: {product.barcode}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.min_stock}</TableCell>
                        <TableCell>
                          <Chip
                            label={stockStatus.label}
                            color={stockStatus.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => openEditModal(product)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => openStockModal(product)}>
                            <InventoryIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Barcode"
              value={productForm.barcode}
              onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={productForm.supplier}
                onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
                label="Supplier"
              >
                <MenuItem value="1">Supplier A</MenuItem>
                <MenuItem value="2">Supplier B</MenuItem>
                <MenuItem value="3">Supplier C</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Cost Price"
              type="number"
              value={productForm.cost_price}
              onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
            />
            <TextField
              fullWidth
              label="Initial Stock"
              type="number"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
            />
            <TextField
              fullWidth
              label="Minimum Stock"
              type="number"
              value={productForm.min_stock}
              onChange={(e) => setProductForm({ ...productForm, min_stock: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} variant="contained">Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Barcode"
              value={productForm.barcode}
              onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={productForm.supplier}
                onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
                label="Supplier"
              >
                <MenuItem value="1">Supplier A</MenuItem>
                <MenuItem value="2">Supplier B</MenuItem>
                <MenuItem value="3">Supplier C</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Cost Price"
              type="number"
              value={productForm.cost_price}
              onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
            />
            <TextField
              fullWidth
              label="Minimum Stock"
              type="number"
              value={productForm.min_stock}
              onChange={(e) => setProductForm({ ...productForm, min_stock: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditProduct} variant="contained">Update Product</Button>
        </DialogActions>
      </Dialog>

      {/* Update Stock Modal */}
      <Dialog open={showStockModal} onClose={() => setShowStockModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Stock</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {stockProduct?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current Stock: {stockProduct?.stock} units
            </Typography>

            <TextField
              fullWidth
              label="Stock Adjustment"
              type="number"
              value={stockForm.adjustment}
              onChange={(e) => setStockForm({ ...stockForm, adjustment: e.target.value })}
              helperText="Use positive numbers to add stock, negative to remove"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reason</InputLabel>
              <Select
                value={stockForm.reason}
                onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                label="Reason"
              >
                <MenuItem value="purchase">Purchase/Restock</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="damage">Damage/Loss</MenuItem>
                <MenuItem value="return">Return</MenuItem>
                <MenuItem value="correction">Stock Correction</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={stockForm.notes}
              onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })}
              placeholder="Additional notes"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStockModal(false)}>Cancel</Button>
          <Button onClick={handleUpdateStock} variant="contained">Update Stock</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
````

## File: src/components/Sidebar.tsx
````typescript
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalShipping as LocalShippingIcon,
  Label as LabelIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Sales', icon: <ShoppingCartIcon />, path: '/pos' },
    { text: 'Reports', icon: <TrendingUpIcon />, path: '/orders' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Products', icon: <CategoryIcon />, path: '/products' },
    { text: 'Suppliers', icon: <LocalShippingIcon />, path: '/suppliers' },
    { text: 'Labels', icon: <LabelIcon />, path: '/labels' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/users' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          Naszaro<span style={{ color: '#f59e0b' }}>POS</span>
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 2,
                backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '15px',
                  },
                }}
              />
              {location.pathname === item.path && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: '60%',
                    backgroundColor: '#f59e0b',
                    borderRadius: 1,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)' }} />

      {/* Logout */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 2,
              mb: 2,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                transform: 'translateX(4px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                '& .MuiListItemText-primary': {
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '15px',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
````

## File: src/components/Suppliers.tsx
````typescript
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  LocalShipping as LocalShippingIcon,
  History as HistoryIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material';

interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  supplierId?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  contactPerson?: string;
  paymentTerms?: string;
  notes?: string;
  productsSupplied: number;
  totalOrders: number;
  lastOrder?: string;
  status: 'active' | 'inactive';
}

const Suppliers: React.FC = () => {
  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Supplier A',
      phone: '123-456-7890',
      email: 'supplierA@example.com',
      supplierId: 'SUP001',
      address: '123 Supplier St',
      city: 'Business City',
      postalCode: '12345',
      contactPerson: 'John Manager',
      paymentTerms: 'net_30',
      notes: 'Primary electronics supplier',
      productsSupplied: 8,
      totalOrders: 15,
      lastOrder: '2024-12-12',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Form states
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    phone: '',
    email: '',
    supplierId: '',
    address: '',
    city: '',
    postalCode: '',
    contactPerson: '',
    paymentTerms: '',
    notes: ''
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSupplier = () => {
    console.log('Adding supplier:', supplierForm);
    setShowAddModal(false);
    resetSupplierForm();
  };

  const handleEditSupplier = () => {
    console.log('Editing supplier:', editingSupplier?.id, supplierForm);
    setShowEditModal(false);
    resetSupplierForm();
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      console.log('Deleting supplier:', supplierId);
    }
  };

  const handleViewHistory = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowHistoryModal(true);
  };

  const handleToggleStatus = (supplierId: string) => {
    if (window.confirm('Toggle supplier status?')) {
      console.log('Toggling status for supplier:', supplierId);
    }
  };

  const resetSupplierForm = () => {
    setSupplierForm({
      name: '',
      phone: '',
      email: '',
      supplierId: '',
      address: '',
      city: '',
      postalCode: '',
      contactPerson: '',
      paymentTerms: '',
      notes: ''
    });
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email || '',
      supplierId: supplier.supplierId || '',
      address: supplier.address || '',
      city: supplier.city || '',
      postalCode: supplier.postalCode || '',
      contactPerson: supplier.contactPerson || '',
      paymentTerms: supplier.paymentTerms || '',
      notes: supplier.notes || ''
    });
    setShowEditModal(true);
  };

  const generateSupplierId = () => {
    const supplierId = 'SUP' + Date.now().toString().slice(-6);
    setSupplierForm({ ...supplierForm, supplierId });
  };


  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Supplier Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
          Add Supplier
        </Button>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 300px' } }}>
              <TextField
                fullWidth
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
              <Button variant="outlined" startIcon={<DownloadIcon />} fullWidth>
                Export
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Products Supplied</TableCell>
                  <TableCell>Total Orders</TableCell>
                  <TableCell>Last Order</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6 }}>
                      <LocalShippingIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No Suppliers Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Start by adding your first supplier
                      </Typography>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
                        Add Supplier
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {supplier.name}
                          </Typography>
                          {supplier.supplierId && (
                            <Typography variant="body2" color="text.secondary">
                              ID: {supplier.supplierId}
                            </Typography>
                          )}
                          {supplier.contactPerson && (
                            <Typography variant="body2" color="text.secondary">
                              Contact: {supplier.contactPerson}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.email || '-'}</TableCell>
                      <TableCell>
                        {supplier.address ? (
                          <Box>
                            <Typography variant="body2">{supplier.address}</Typography>
                            {supplier.city && (
                              <Typography variant="body2" color="text.secondary">
                                {supplier.city}{supplier.postalCode ? `, ${supplier.postalCode}` : ''}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.productsSupplied}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{supplier.totalOrders}</TableCell>
                      <TableCell>{supplier.lastOrder || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.status}
                          color={supplier.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => openEditModal(supplier)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleViewHistory(supplier)}>
                          <HistoryIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleToggleStatus(supplier.id)}>
                          <ToggleOnIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteSupplier(supplier.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Supplier Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Supplier</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Supplier Name"
              value={supplierForm.name}
              onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={supplierForm.phone}
              onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={supplierForm.email}
              onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Supplier ID"
                value={supplierForm.supplierId}
                onChange={(e) => setSupplierForm({ ...supplierForm, supplierId: e.target.value })}
                placeholder="Auto-generated if empty"
              />
              <Button variant="outlined" onClick={generateSupplierId}>
                Generate
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Address"
              value={supplierForm.address}
              onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
              placeholder="Street address"
            />
            <TextField
              fullWidth
              label="City"
              value={supplierForm.city}
              onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
            />
            <TextField
              fullWidth
              label="Postal Code"
              value={supplierForm.postalCode}
              onChange={(e) => setSupplierForm({ ...supplierForm, postalCode: e.target.value })}
            />
            <TextField
              fullWidth
              label="Contact Person"
              value={supplierForm.contactPerson}
              onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Payment Terms</InputLabel>
              <Select
                value={supplierForm.paymentTerms}
                onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                label="Payment Terms"
              >
                <MenuItem value="net_15">Net 15 days</MenuItem>
                <MenuItem value="net_30">Net 30 days</MenuItem>
                <MenuItem value="net_45">Net 45 days</MenuItem>
                <MenuItem value="net_60">Net 60 days</MenuItem>
                <MenuItem value="cash_on_delivery">Cash on Delivery</MenuItem>
                <MenuItem value="immediate">Immediate Payment</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={supplierForm.notes}
                onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })}
                placeholder="Additional notes about the supplier"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddSupplier} variant="contained">Add Supplier</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Supplier</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Supplier Name"
              value={supplierForm.name}
              onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={supplierForm.phone}
              onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={supplierForm.email}
              onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Supplier ID"
              value={supplierForm.supplierId}
              onChange={(e) => setSupplierForm({ ...supplierForm, supplierId: e.target.value })}
            />
            <TextField
              fullWidth
              label="Address"
              value={supplierForm.address}
              onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
            />
            <TextField
              fullWidth
              label="City"
              value={supplierForm.city}
              onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
            />
            <TextField
              fullWidth
              label="Postal Code"
              value={supplierForm.postalCode}
              onChange={(e) => setSupplierForm({ ...supplierForm, postalCode: e.target.value })}
            />
            <TextField
              fullWidth
              label="Contact Person"
              value={supplierForm.contactPerson}
              onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Payment Terms</InputLabel>
              <Select
                value={supplierForm.paymentTerms}
                onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                label="Payment Terms"
              >
                <MenuItem value="net_15">Net 15 days</MenuItem>
                <MenuItem value="net_30">Net 30 days</MenuItem>
                <MenuItem value="net_45">Net 45 days</MenuItem>
                <MenuItem value="net_60">Net 60 days</MenuItem>
                <MenuItem value="cash_on_delivery">Cash on Delivery</MenuItem>
                <MenuItem value="immediate">Immediate Payment</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={supplierForm.notes}
                onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditSupplier} variant="contained">Update Supplier</Button>
        </DialogActions>
      </Dialog>

      {/* Supplier History Modal */}
      <Dialog open={showHistoryModal} onClose={() => setShowHistoryModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Supplier Order History</DialogTitle>
        <DialogContent>
          {selectedSupplier && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Orders
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Products</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>#SUP001</TableCell>
                        <TableCell>Dec 12, 2024</TableCell>
                        <TableCell>5 products</TableCell>
                        <TableCell>$1,250.00</TableCell>
                        <TableCell>
                          <Chip label="Delivered" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#SUP002</TableCell>
                        <TableCell>Dec 5, 2024</TableCell>
                        <TableCell>3 products</TableCell>
                        <TableCell>$890.50</TableCell>
                        <TableCell>
                          <Chip label="Pending" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Supplier Summary
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                        {selectedSupplier.productsSupplied}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Products Supplied
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                        ${selectedSupplier.totalOrders.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Orders
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                        7 days
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Order
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Suppliers;
````

## File: src/components/Users.tsx
````typescript
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  History as HistoryIcon,
  LockReset as LockResetIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  employeeId?: string;
  role: 'staff' | 'manager' | 'admin';
  status: 'active' | 'inactive';
  lastLogin?: string;
  created: string;
  address?: string;
  phone?: string;
}

const Users: React.FC = () => {
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      employeeId: 'EMP001',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-12-15 14:30',
      created: '2024-01-01',
      phone: '123-456-7890'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    email: '',
    employeeId: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
    phone: '',
    address: '',
    notes: ''
  });

  const [resetForm, setResetForm] = useState({
    newPassword: '',
    confirmNewPassword: '',
    forceChange: false
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const summaryStats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === 'active').length,
    admins: users.filter(user => user.role === 'admin').length,
    newThisMonth: users.filter(user =>
      new Date(user.created) > new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
    ).length
  };

  const handleAddUser = () => {
    if (userForm.password !== userForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Adding user:', userForm);
    setShowAddModal(false);
    resetUserForm();
  };

  const handleEditUser = () => {
    console.log('Editing user:', editingUser?.id, userForm);
    setShowEditModal(false);
    resetUserForm();
  };

  const handleResetPassword = () => {
    if (resetForm.newPassword !== resetForm.confirmNewPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Resetting password for:', selectedUser?.id, resetForm);
    setShowResetModal(false);
    resetResetForm();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user:', userId);
    }
  };

  const handleViewActivity = (user: User) => {
    setSelectedUser(user);
    setShowActivityModal(true);
  };

  const handleToggleStatus = (userId: string) => {
    if (window.confirm('Toggle user status?')) {
      console.log('Toggling status for user:', userId);
    }
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      username: '',
      email: '',
      employeeId: '',
      password: '',
      confirmPassword: '',
      role: 'staff',
      phone: '',
      address: '',
      notes: ''
    });
  };

  const resetResetForm = () => {
    setResetForm({
      newPassword: '',
      confirmNewPassword: '',
      forceChange: false
    });
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      username: user.username,
      email: user.email || '',
      employeeId: user.employeeId || '',
      password: '',
      confirmPassword: '',
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      notes: ''
    });
    setShowEditModal(true);
  };

  const openResetModal = (user: User) => {
    setSelectedUser(user);
    setShowResetModal(true);
  };

  const generateEmployeeId = () => {
    const employeeId = 'EMP' + Date.now().toString().slice(-6);
    setUserForm({ ...userForm, employeeId });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'staff': return 'primary';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'staff': return 'Staff';
      default: return role;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          User Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
          Add User
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Total Users
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active user accounts
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonAddIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Active Users
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.activeUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Currently active
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AdminIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Administrators
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.admins}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin privileges
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonAddIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                New This Month
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.newThisMonth}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recently added
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 300px' } }}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 150px' } }}>
              <Button variant="outlined" startIcon={<DownloadIcon />} fullWidth>
                Export
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                      <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No Users Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Start by adding your first user
                      </Typography>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
                        Add User
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {user.name}
                          </Typography>
                          {user.employeeId && (
                            <Typography variant="body2" color="text.secondary">
                              ID: {user.employeeId}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={user.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.lastLogin || '-'}</TableCell>
                      <TableCell>{user.created}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => openEditModal(user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => openResetModal(user)}>
                          <LockResetIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleViewActivity(user)}>
                          <HistoryIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleToggleStatus(user.id)}>
                          <ToggleOnIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Username"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Employee ID"
                value={userForm.employeeId}
                onChange={(e) => setUserForm({ ...userForm, employeeId: e.target.value })}
                placeholder="Auto-generated if empty"
              />
              <Button variant="outlined" onClick={generateEmployeeId}>
                Generate
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={userForm.confirmPassword}
              onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                label="Role"
                required
              >
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Phone"
              value={userForm.phone}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Address"
              value={userForm.address}
              onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
              placeholder="Street address"
            />
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={userForm.notes}
                onChange={(e) => setUserForm({ ...userForm, notes: e.target.value })}
                placeholder="Additional notes about the user"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Username"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Employee ID"
              value={userForm.employeeId}
              onChange={(e) => setUserForm({ ...userForm, employeeId: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                label="Role"
                required
              >
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Phone"
              value={userForm.phone}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Address"
              value={userForm.address}
              onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
            />
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={userForm.notes}
                onChange={(e) => setUserForm({ ...userForm, notes: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditUser} variant="contained">Update User</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={showResetModal} onClose={() => setShowResetModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedUser?.name}
            </Typography>

            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={resetForm.newPassword}
              onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={resetForm.confirmNewPassword}
              onChange={(e) => setResetForm({ ...resetForm, confirmNewPassword: e.target.value })}
              sx={{ mb: 2 }}
              required
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={resetForm.forceChange}
                onChange={(e) => setResetForm({ ...resetForm, forceChange: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              <Typography>Force password change on next login</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetModal(false)}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained">Reset Password</Button>
        </DialogActions>
      </Dialog>

      {/* User Activity Modal */}
      <Dialog open={showActivityModal} onClose={() => setShowActivityModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>User Activity History</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>IP Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Dec 15, 2024 14:30</TableCell>
                      <TableCell>Login</TableCell>
                      <TableCell>Successful login</TableCell>
                      <TableCell>192.168.1.100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dec 15, 2024 14:25</TableCell>
                      <TableCell>Order Created</TableCell>
                      <TableCell>Order #ORD001</TableCell>
                      <TableCell>192.168.1.100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dec 15, 2024 09:15</TableCell>
                      <TableCell>Product Updated</TableCell>
                      <TableCell>Updated iPhone stock</TableCell>
                      <TableCell>192.168.1.100</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowActivityModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
````

## File: src/App.css
````css
#root {
  height: 100vh;
  width: 100vw;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
````

## File: src/App.tsx
````typescript
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Drawer, AppBar, Toolbar, IconButton, useMediaQuery, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Products from './components/Products';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Orders from './components/Orders';
import Users from './components/Users';
import Labels from './components/Labels';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
    },
    warning: {
      main: '#f97316',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

const drawerWidth = 280;

function AppContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Update document title based on current route
  useEffect(() => {
    const path = location.pathname.substring(1);
    const title = path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
    document.title = `${title} - NexusPOS`;
  }, [location]);

  // Simulate page loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      initializePageSpecificFeatures(location.pathname.substring(1) || 'dashboard');
    }, 500);
    return () => clearTimeout(timer);
  }, [location]);

  // Initialize page-specific features
  const initializePageSpecificFeatures = (page: string) => {
    switch(page) {
      case 'pos':
        // initializePOS will be called from POS component
        break;
      case 'dashboard':
        // Initialize dashboard-specific features if needed
        break;
      // Add other cases for different pages
    }

  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
          },
        }}
      >
        <Sidebar onClose={handleDrawerToggle} />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: 0 },
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'text.primary',
            mb: 3,
            borderRadius: 3,
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Header />
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ mt: 2, flexGrow: 1, overflow: 'auto', width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: '2rem', mb: 2 }}>⏳</Box>
                <Typography variant="h6">Loading...</Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, width: '100%', maxWidth: '100%' }}>
              
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/products" element={<Products />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/users" element={<Users />} />
                <Route path="/labels" element={<Labels />} />
              </Routes>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
````

## File: src/index.css
````css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  width: 100%;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
````

## File: src/main.tsx
````typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
````

## File: src/vite-env.d.ts
````typescript
/// <reference types="vite/client" />
````

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
````

## File: .repomixignore
````
# Add patterns to ignore here, one per line
# Example:
# *.log
# tmp/
````

## File: eslint.config.js
````javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
````

## File: README.md
````markdown
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
````

## File: repomix.config.json
````json
{
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "compress": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": []
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
````

## File: tsconfig.app.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
````

## File: tsconfig.json
````json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
````

## File: index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Naszaro-POS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './POS',
})
````

## File: package.json
````json
{
  "name": "react-pos",
  "homepage": "https://naszaro.com/poss/",
  "private": true,
  "version": "0.0.0",
  "type": "module",
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
},
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.2",
    "@mui/lab": "^7.0.0-beta.17",
    "@mui/material": "^7.3.2",
    "gh-pages": "^6.3.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.39.1",
    "vite": "^7.1.2"
  }
}
````
