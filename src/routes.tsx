import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
//pages & auth context
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingListPage from './pages/ShoppingListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import PriceTrendsPage from './pages/PriceTrendsPage';

import { useAuth } from './contexts/AuthContext';

//protected route
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useAuth();
  
  if (authState.loading) {
    //laoding indicator
    return <div>Loading...</div>;
  }
  
//if login fails
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
//guest route directs to home page
interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { authState } = useAuth();
  
  if (authState.loading) {
    return <div>Loading...</div>;
  }
  
  if (authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* public access routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/price-trends" element={<PriceTrendsPage />} />
      
      {/* guest (not logged in) routes*/}
      <Route path="/login" element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      } />
      
      {/* protected (logged in) routes ~ profile page and shopping lists*/}
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/shopping-lists" element={
        <ProtectedRoute>
          <ShoppingListPage />
        </ProtectedRoute>
      } />
      
      {/* not found / 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;