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