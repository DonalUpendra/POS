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
                        <TableCell>Rs.1,250.00</TableCell>
                        <TableCell>
                          <Chip label="Delivered" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#SUP002</TableCell>
                        <TableCell>Dec 5, 2024</TableCell>
                        <TableCell>3 products</TableCell>
                        <TableCell>Rs.890.50</TableCell>
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
                        Rs.{selectedSupplier.totalOrders.toFixed(2)}
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