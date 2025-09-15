import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, userType }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    const redirectTo = userType === 'teacher' ? '/login/teacher' : '/';
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Optional role check:
  // if (userType && currentUser.role !== userType) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
