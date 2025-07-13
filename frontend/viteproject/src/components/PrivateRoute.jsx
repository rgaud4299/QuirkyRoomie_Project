import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext

  // While authentication status is being checked, you might want to show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, render the children (the protected component)
  // Otherwise, redirect to the login page
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
