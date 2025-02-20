// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // ✅ Corrected import

const ProtectedRoute = ({ requiredRole, children }) => {
    const token = localStorage.getItem('authToken');
    console.log('Auth Token in ProtectedRoute:', token);

    if (!token) {
        console.warn('No token found. Redirecting to login...');
        return <Navigate to="/login" replace />;
    }

    try {
        // Decode the JWT to get user information
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
            console.warn('Token expired. Redirecting to login...');
            localStorage.removeItem('authToken');
            return <Navigate to="/login" replace />;
        }

        // Check user role if a specific role is required
        if (requiredRole && decodedToken.role !== requiredRole) {
            console.warn('Insufficient permissions. Redirecting to home...');
            return <Navigate to="/" replace />;
        }

        // Render the protected component if all checks pass
        return children;

    } catch (error) {
        console.error('Invalid token. Redirecting to login...', error);
        localStorage.removeItem('authToken');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
