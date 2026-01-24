import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../constants/roles';

/**
 * ProtectedRoute - Requires authentication
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

/**
 * RoleProtectedRoute - Requires specific role(s)
 * Redirects to unauthorized page if user doesn't have required role
 */
export const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

/**
 * AdminRoute - Only accessible by admins
 */
export const AdminRoute = ({ children }) => {
    return (
        <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {children}
        </RoleProtectedRoute>
    );
};

/**
 * PrivilegedRoute - Accessible by privileged users and admins
 */
export const PrivilegedRoute = ({ children }) => {
    return (
        <RoleProtectedRoute allowedRoles={[USER_ROLES.PRIVILEGED_USER, USER_ROLES.ADMIN]}>
            {children}
        </RoleProtectedRoute>
    );
};

/**
 * PublicRoute - Only accessible when NOT logged in
 * Redirects to dashboard if already authenticated
 */
export const PublicRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (currentUser) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
