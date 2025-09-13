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
  buyPrice: number;
  sellPrice: number;
  totalValue: number;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired' | 'damaged' | 'returns' | 'owner_bearing';
  barcode?: string;
  unit: string;
  expiryDate?: string;
  photo?: string;
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
    barcode: '',
    buyPrice: '',
    sellPrice: '',
    photo: null as File | null,
    expiryDate: ''
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

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
      barcode: '',
      buyPrice: '',
      sellPrice: '',
      photo: null,
      expiryDate: ''
    });

    // Clean up preview URL
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
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
          buyPrice: parseFloat(addProductForm.buyPrice) || 0,
          sellPrice: parseFloat(addProductForm.sellPrice) || 0,
          barcode: addProductForm.barcode || '',
          unit: addProductForm.unit,
          photo: addProductForm.photo ? addProductForm.photo.name : null,
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
      case 'returns': return 'warning';
      case 'owner_bearing': return 'success';
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
      case 'returns': return 'Returns';
      case 'owner_bearing': return 'Owner Bearing';
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
              Rs.{summaryStats.totalValue.toFixed(2)}
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
                  <MenuItem value="returns">Returns</MenuItem>
                  <MenuItem value="owner_bearing">Owner Bearing</MenuItem>
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
                  <TableCell>Buy Price</TableCell>
                  <TableCell>Sell Price</TableCell>
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
                    <TableCell colSpan={12} sx={{ textAlign: 'center', py: 6 }}>
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
                      <TableCell>Rs.{item.buyPrice.toFixed(2)}</TableCell>
                      <TableCell>Rs.{item.sellPrice.toFixed(2)}</TableCell>
                      <TableCell>Rs.{item.totalValue.toFixed(2)}</TableCell>
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

            <TextField
              fullWidth
              label="Barcode"
              value={addProductForm.barcode}
              onChange={(e) => setAddProductForm({ ...addProductForm, barcode: e.target.value })}
              sx={{ mb: 2 }}
            />

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

             <Box sx={{ mb: 2 }}>
               <input
                 accept="image/*"
                 style={{ display: 'none' }}
                 id="product-photo"
                 type="file"
                 onChange={(e) => {
                   const file = e.target.files ? e.target.files[0] : null;
                   setAddProductForm({ ...addProductForm, photo: file });

                   // Clean up previous preview URL
                   if (photoPreview) {
                     URL.revokeObjectURL(photoPreview);
                   }

                   // Create new preview URL
                   if (file) {
                     setPhotoPreview(URL.createObjectURL(file));
                   } else {
                     setPhotoPreview(null);
                   }
                 }}
               />
               <label htmlFor="product-photo">
                 <Button variant="outlined" component="span" fullWidth>
                   Upload Product Photo
                 </Button>
               </label>
               {photoPreview && (
                 <Box sx={{ mt: 2, textAlign: 'center' }}>
                   <img
                     src={photoPreview}
                     alt="Product preview"
                     style={{
                       maxWidth: '100%',
                       maxHeight: '200px',
                       objectFit: 'contain',
                       border: '1px solid #ddd',
                       borderRadius: '8px'
                     }}
                   />
                   <Typography variant="body2" sx={{ mt: 1 }}>
                     {addProductForm.photo?.name}
                   </Typography>
                 </Box>
               )}
             </Box>

             <TextField
               fullWidth
               label="Minimum Stock"
              type="number"
              value={addProductForm.minStock}
              onChange={(e) => setAddProductForm({ ...addProductForm, minStock: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Buy Price"
                type="number"
                value={addProductForm.buyPrice}
                onChange={(e) => setAddProductForm({ ...addProductForm, buyPrice: e.target.value })}
              />
              <TextField
                fullWidth
                label="Sell Price"
                type="number"
                value={addProductForm.sellPrice}
                onChange={(e) => setAddProductForm({ ...addProductForm, sellPrice: e.target.value })}
              />
            </Box>

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