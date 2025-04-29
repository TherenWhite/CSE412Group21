import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ShoppingListPage.css';

const ShoppingListPage: React.FC = () => {
  const { authState } = useAuth();
  const { isAuthenticated } = authState;
  
  return (
    <div className="shopping-list-page">
      <h1>My Shopping Lists</h1>
      
      {isAuthenticated ? (
        <div className="under-construction">
          <p>shopping lists coming soon</p>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Log in to manage shopping lists!</p>
          <Link to="/login" className="login-button">
            Log In
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShoppingListPage;