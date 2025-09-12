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