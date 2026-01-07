import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      // Optional: Show a toast when redirecting
      // toast.error("Please login to access this page"); 
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;