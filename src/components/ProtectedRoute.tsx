import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: User['role'][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body2">
            You don't have permission to access this page. Your current role: {user?.role}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;