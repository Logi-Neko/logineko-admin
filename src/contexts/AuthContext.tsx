import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra token khi component mount
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem('access_token');
    const isAuth = !!token;
    setIsAuthenticated(isAuth);
    return isAuth;
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;