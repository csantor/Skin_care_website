import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
