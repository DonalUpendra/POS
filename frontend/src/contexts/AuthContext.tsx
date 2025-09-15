import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
  username: string;
  role: 'owner' | 'manager' | 'cashier';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string, role: string): boolean => {
    // Simple demo authentication - in real app, this would be API call
    const validCredentials = [
      { username: 'admin', password: 'admin', role: 'owner' },
      { username: 'manager', password: 'manager', role: 'manager' },
      { username: 'cashier', password: 'cashier', role: 'cashier' },
    ];

    const foundUser = validCredentials.find(
      (cred) => cred.username === username && cred.password === password && cred.role === role
    );

    if (foundUser) {
      const userData: User = { username: foundUser.username, role: foundUser.role as User['role'] };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};