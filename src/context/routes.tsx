import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './authContext';

const PrivateRoute: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext must be used within an AuthProvider');

  const { user } = authContext;

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;