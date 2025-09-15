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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  orderTime: string;
  status: 'pending' | 'holding' | 'completed' | 'cancelled';
  paymentMethod?: string;
}

const DisplayOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD001',
      customer: 'John Doe',
      items: 3,
      total: 45.99,
      orderTime: '2024-12-15 14:30',
      status: 'holding',
      paymentMethod: 'Cash'
    },
    {
      id: '2',
      orderNumber: 'ORD002',
      customer: 'Jane Smith',
      items: 2,
      total: 30.50,
      orderTime: '2024-12-15 15:00',
      status: 'completed',
      paymentMethod: 'Card'
    },
    {
      id: '3',
      orderNumber: 'ORD003',
      customer: 'Bob Johnson',
      items: 1,
      total: 15.00,
      orderTime: '2024-12-15 15:30',
      status: 'holding',
      paymentMethod: 'Cash'
    }
  ]);

  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    orderId: string | null;
    orderNumber: string;
  }>({
    open: false,
    orderId: null,
    orderNumber: '',
  });

  const holdingOrders = orders.filter(order => order.status === 'holding');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const cancelledOrders = orders.filter(order => order.status === 'cancelled');

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'completed' as const } : order
      )
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      )
    );
  };

  const handleOpenCancelDialog = (orderId: string, orderNumber: string) => {
    setCancelDialog({
      open: true,
      orderId,
      orderNumber,
    });
  };

  const handleCloseCancelDialog = () => {
    setCancelDialog({
      open: false,
      orderId: null,
      orderNumber: '',
    });
  };

  const handleConfirmCancel = () => {
    if (cancelDialog.orderId) {
      handleCancelOrder(cancelDialog.orderId);
      handleCloseCancelDialog();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'holding': return 'secondary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'holding': return 'Holding';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const renderHoldingOrdersCards = (orders: Order[]) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
      {orders.length === 0 ? (
        <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
          <PauseIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" color="text.secondary">
            No Holding Orders
          </Typography>
          <Typography variant="h6" color="text.secondary">
            No orders are currently on hold
          </Typography>
        </Box>
      ) : (
        orders.map((order) => (
          <Box key={order.id} sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {order.orderNumber}
                </Typography>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {order.customer}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Items: {order.items}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Total: Rs.{order.total.toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {order.orderTime}
                </Typography>
                <Chip
                  label={getStatusLabel(order.status)}
                  color={getStatusColor(order.status)}
                  size="medium"
                  sx={{ mb: 2 }}
                />
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  startIcon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
                  onClick={() => handleCompleteOrder(order.id)}
                  sx={{ py: 2, fontSize: '1.2rem', flex: 1 }}
                >
                  Complete
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<CancelIcon sx={{ fontSize: 28 }} />}
                  onClick={() => handleOpenCancelDialog(order.id, order.orderNumber)}
                  sx={{ py: 2, fontSize: '1.2rem', minWidth: '120px' }}
                >
                  Cancel
                </Button>
              </Box>
            </Card>
          </Box>
        ))
      )}
    </Box>
  );

  const renderOrderTable = (orders: Order[], isHolding: boolean) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Order Time</TableCell>
            <TableCell>Status</TableCell>
            {isHolding && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isHolding ? 7 : 6} sx={{ textAlign: 'center', py: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  {isHolding ? (
                    <PauseIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  ) : (
                    <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  )}
                  <Typography variant="h6" color="text.secondary">
                    {isHolding ? 'No Holding Orders' : 'No Completed Orders'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isHolding ? 'No orders are currently on hold' : 'Completed orders will appear here'}
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
                <TableCell>
                  <Chip
                    label={getStatusLabel(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                {isHolding && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleCompleteOrder(order.id)}
                    >
                      Complete
                    </Button>
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
    <Box sx={{ width: '100%', maxWidth: '100%', p: 2 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
        Kitchen Orders Display
      </Typography>

      {/* Holding Orders Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PauseIcon sx={{ mr: 2, color: 'secondary.main', fontSize: 40 }} />
          Holding Orders ({holdingOrders.length})
        </Typography>
        {renderHoldingOrdersCards(holdingOrders)}
      </Box>

      {/* Completed Orders Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
            Completed Orders ({completedOrders.length})
          </Typography>
          {renderOrderTable(completedOrders, false)}
        </CardContent>
      </Card>

      {/* Cancelled Orders Section */}
      {cancelledOrders.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CancelIcon sx={{ mr: 1, color: 'error.main' }} />
              Cancelled Orders ({cancelledOrders.length})
            </Typography>
            {renderOrderTable(cancelledOrders, false)}
          </CardContent>
        </Card>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={handleCloseCancelDialog}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <CancelIcon sx={{ mr: 1, color: 'error.main' }} />
          Confirm Cancellation
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Are you sure you want to cancel order <strong>{cancelDialog.orderNumber}</strong>?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This action cannot be undone. The order will be marked as cancelled and removed from the holding orders list.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseCancelDialog}
            variant="outlined"
            size="large"
            sx={{ mr: 2 }}
          >
            No, Keep Order
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            size="large"
            startIcon={<CancelIcon />}
          >
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DisplayOrders;