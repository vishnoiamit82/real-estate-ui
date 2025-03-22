// ✅ Updated ProtectedRoute.js to inject currentUser from JWT into children
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ requiredRole, children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('No token found. Redirecting to login...');
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      console.warn('Token expired. Redirecting to login...');
      localStorage.removeItem('authToken');
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && decodedToken.role !== requiredRole) {
      console.warn('Insufficient permissions. Redirecting to home...');
      return <Navigate to="/" replace />;
    }

    // Inject currentUser into child component props
    return React.cloneElement(children, { currentUser: decodedToken });

  } catch (error) {
    console.error('Invalid token. Redirecting to login...', error);
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
