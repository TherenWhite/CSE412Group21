import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ShoppingListProvider } from './contexts/ShoppingListContext';
import AppRoutes from './routes';
import ProductFilter from './components/products/ProductFilter';
import ProductDetailPage from './pages/ProductDetailPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ShoppingListProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </ShoppingListProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;