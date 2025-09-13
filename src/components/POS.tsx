import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Autocomplete,
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
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Sample Product 1', price: 29.99, stock: 50, category: 'Electronics' },
    { id: '2', name: 'Sample Product 2', price: 19.99, stock: 30, category: 'Clothing' },
    { id: '3', name: 'Sample Product 3', price: 9.99, stock: 100, category: 'Food' },
  ]);

  const customers = [
    { id: '', name: 'Walk-in Customer' },
    { id: '1', name: 'John Doe', phone: '123-456-7890' },
    { id: '2', name: 'Jane Smith', phone: '987-654-3210' },
  ];
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
  const [returnNote, setReturnNote] = useState('');
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
  const total = discountedSubtotal;

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

    if (paymentMethod === 'credit' && (!customerSelect || customerSelect === '')) {
      alert('A registered customer is required for credit payment!');
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
    alert(`Return functionality would be implemented here. Receipt: ${returnReceiptNumber}, Note: ${returnNote}`);
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
                          Rs.{product.price.toFixed(2)}
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
              <Autocomplete
                fullWidth
                sx={{ mb: 2 }}
                options={customers}
                getOptionLabel={(option) => option.name + (option.phone ? ` - ${option.phone}` : '')}
                value={customers.find(c => c.id === customerSelect) || null}
                onChange={(event, newValue) => setCustomerSelect(newValue ? newValue.id : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={paymentMethod === 'credit' ? 'Customer *' : 'Customer'}
                    placeholder="Type to search customers..."
                    error={paymentMethod === 'credit' && (!customerSelect || customerSelect === '')}
                    helperText={paymentMethod === 'credit' && (!customerSelect || customerSelect === '') ? 'Registered customer required for credit payment' : ''}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />

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
                          Rs.{item.price.toFixed(2)} each
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
                        Rs.{(item.price * item.quantity).toFixed(2)}
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
                    <MenuItem value="amount">Rs.</MenuItem>
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
                  <Typography>Rs.{subtotal.toFixed(2)}</Typography>
                </Box>
                {discountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'error.main' }}>
                    <Typography>Discount</Typography>
                    <Typography>-Rs.{discountAmount.toFixed(2)}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">Rs.{total.toFixed(2)}</Typography>
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
                      Change: Rs.{(calculateChange()).toFixed(2)}
                    </Typography>
                  )}
                  {cashReceived && parseFloat(cashReceived) < total && (
                    <Typography sx={{ mt: 1, color: 'error.main', textAlign: 'center' }}>
                      Insufficient: Rs.{(total - parseFloat(cashReceived)).toFixed(2)}
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
          <Button variant="contained" onClick={() => navigate('/orders')}>
            View All Orders
          </Button>
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
          <TextField
            fullWidth
            label="Additional Note"
            multiline
            rows={4}
            value={returnNote}
            onChange={(e) => setReturnNote(e.target.value)}
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