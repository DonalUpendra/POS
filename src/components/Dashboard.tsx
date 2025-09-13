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
      value: 'Rs.0.00',
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