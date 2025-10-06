import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const location = useLocation();

  // Kiểm tra authentication status trong useEffect để tránh state update during render
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    // Redirect đến login page và lưu lại current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;