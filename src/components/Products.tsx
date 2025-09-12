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