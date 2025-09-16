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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
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
  supplier_id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  contact_person?: string;
  payment_terms?: string;
  notes?: string;
  products_supplied: number;
  total_orders: number;
  last_order_date?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    supplier_id: '',
    address: '',
    city: '',
    postal_code: '',
    contact_person: '',
    payment_terms: '',
    notes: ''
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSupplier = async () => {
    try {
      const supplierData = {
        name: supplierForm.name,
        phone: supplierForm.phone,
        email: supplierForm.email,
        supplier_id: supplierForm.supplier_id,
        address: supplierForm.address,
        city: supplierForm.city,
        postal_code: supplierForm.postal_code,
        contact_person: supplierForm.contact_person,
        payment_terms: supplierForm.payment_terms,
        notes: supplierForm.notes
      };

      await createSupplier(supplierData);
      setShowAddModal(false);
      resetSupplierForm();
      alert('Supplier created successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create supplier');
    }
  };

  const handleEditSupplier = async () => {
    if (!editingSupplier) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`/api/suppliers/${editingSupplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: supplierForm.name,
          phone: supplierForm.phone,
          email: supplierForm.email,
          address: supplierForm.address,
          city: supplierForm.city,
          postal_code: supplierForm.postal_code,
          contact_person: supplierForm.contact_person,
          payment_terms: supplierForm.payment_terms,
          notes: supplierForm.notes
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update supplier');
      }

      // Refresh suppliers list
      await fetchSuppliers();
      setShowEditModal(false);
      resetSupplierForm();
      alert('Supplier updated successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update supplier');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!window.confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete supplier');
      }

      // Refresh suppliers list
      await fetchSuppliers();
      alert('Supplier deleted successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete supplier');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewHistory = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowHistoryModal(true);
  };

  const handleToggleStatus = async (supplierId: string) => {
    if (!window.confirm('Are you sure you want to toggle this supplier\'s status?')) {
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`/api/suppliers/${supplierId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle supplier status');
      }

      const data = await response.json();
      // Refresh suppliers list
      await fetchSuppliers();
      alert(data.message);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to toggle supplier status');
    } finally {
      setSubmitting(false);
    }
  };

  const resetSupplierForm = () => {
    setSupplierForm({
      name: '',
      phone: '',
      email: '',
      supplier_id: '',
      address: '',
      city: '',
      postal_code: '',
      contact_person: '',
      payment_terms: '',
      notes: ''
    });
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email || '',
      supplier_id: supplier.supplier_id || '',
      address: supplier.address || '',
      city: supplier.city || '',
      postal_code: supplier.postal_code || '',
      contact_person: supplier.contact_person || '',
      payment_terms: supplier.payment_terms || '',
      notes: supplier.notes || ''
    });
    setShowEditModal(true);
  };

  const generateSupplierId = () => {
    const supplierId = 'SUP' + Date.now().toString().slice(-6);
    setSupplierForm({ ...supplierForm, supplier_id: supplierId });
  };

  // API functions
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        throw new Error('Failed to fetch suppliers');
      }

      const data = await response.json();
      setSuppliers(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: any) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create supplier');
      }

      const data = await response.json();
      setSuppliers(prev => [...prev, data.data]);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
                          {supplier.supplier_id && (
                            <Typography variant="body2" color="text.secondary">
                              ID: {supplier.supplier_id}
                            </Typography>
                          )}
                          {supplier.contact_person && (
                            <Typography variant="body2" color="text.secondary">
                              Contact: {supplier.contact_person}
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
                                {supplier.city}{supplier.postal_code ? `, ${supplier.postal_code}` : ''}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.products_supplied}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{supplier.total_orders}</TableCell>
                      <TableCell>{supplier.last_order_date ? new Date(supplier.last_order_date).toLocaleDateString() : '-'}</TableCell>
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
                value={supplierForm.supplier_id}
                onChange={(e) => setSupplierForm({ ...supplierForm, supplier_id: e.target.value })}
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
              value={supplierForm.postal_code}
              onChange={(e) => setSupplierForm({ ...supplierForm, postal_code: e.target.value })}
            />
            <TextField
              fullWidth
              label="Contact Person"
              value={supplierForm.contact_person}
              onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Payment Terms</InputLabel>
              <Select
                value={supplierForm.payment_terms}
                onChange={(e) => setSupplierForm({ ...supplierForm, payment_terms: e.target.value })}
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
          <Button onClick={() => setShowAddModal(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleAddSupplier} variant="contained" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Supplier'}
          </Button>
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
              value={supplierForm.supplier_id}
              onChange={(e) => setSupplierForm({ ...supplierForm, supplier_id: e.target.value })}
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
              value={supplierForm.postal_code}
              onChange={(e) => setSupplierForm({ ...supplierForm, postal_code: e.target.value })}
            />
            <TextField
              fullWidth
              label="Contact Person"
              value={supplierForm.contact_person}
              onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Payment Terms</InputLabel>
              <Select
                value={supplierForm.payment_terms}
                onChange={(e) => setSupplierForm({ ...supplierForm, payment_terms: e.target.value })}
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
          <Button onClick={() => setShowEditModal(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleEditSupplier} variant="contained" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Supplier'}
          </Button>
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
                        {selectedSupplier.products_supplied}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Products Supplied
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                        Rs.{selectedSupplier.total_orders.toFixed(2)}
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