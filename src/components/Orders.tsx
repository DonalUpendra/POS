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
                <TableCell>Rs.{order.total.toFixed(2)}</TableCell>
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
              Rs.{summaryStats.totalRevenue.toFixed(2)}
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
                    <Typography><strong>Subtotal:</strong> Rs.{(selectedOrder.total * 0.92).toFixed(2)}</Typography>
                    <Typography><strong>Tax:</strong> Rs.{(selectedOrder.total * 0.08).toFixed(2)}</Typography>
                    <Typography variant="h6"><strong>Total:</strong> Rs.{selectedOrder.total.toFixed(2)}</Typography>
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
                      <TableCell>Rs.{(selectedOrder.total / selectedOrder.items).toFixed(2)}</TableCell>
                      <TableCell>Rs.{selectedOrder.total.toFixed(2)}</TableCell>
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
                Customer: {selectedOrder.customer} | Total: Rs.{selectedOrder.total.toFixed(2)}
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