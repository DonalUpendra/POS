import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Get UTC time by adjusting for local timezone offset
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      // Adjust for Asia/Colombo timezone (UTC+5:30)
      const colomboOffset = 5.5 * 60 * 60000; // 5.5 hours in milliseconds
      const colomboTime = new Date(utc + colomboOffset);
      const dateStr = colomboTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = colomboTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(`${dateStr} | ${timeStr}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    // Implement search functionality here
    console.log('Searching for:', term);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 3 }}>
      {/* Search Bar */}
      <TextField
        placeholder="Search products, customers..."
        value={searchTerm}
        onChange={handleSearch}
        variant="outlined"
        size="small"
        sx={{
          flex: 1,
          maxWidth: 320,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: 3,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* DateTime Display */}
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '16px',
          }}
        >
          {currentTime}
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            User
          </Typography>
          <Chip
            label="Staff"
            size="small"
            sx={{
              fontSize: '11px',
              height: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
          />
        </Box>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            fontWeight: 700,
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          U
        </Avatar>
      </Box>
    </Box>
  );
};

export default Header;