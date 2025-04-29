import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import './Header.css';

const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const { isAuthenticated, user } = authState;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    //direct to search with the populated fields
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Local Grocery Price Tracker</h1>
        </Link>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className="menu-icon"></span>
        </button>

        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/price-trends" className="nav-link">Price Trends</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/shopping-lists" className="nav-link">Shopping Lists</Link>
                </li>
                <li className="nav-item user-menu">
                  <span className="user-menu-trigger">
                    {user?.email}
                    <span className="dropdown-arrow"></span>
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile" className="dropdown-item">Profile</Link>
                    </li>
                    <li>
                      <button onClick={logout} className="dropdown-item">Logout</button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link sign-up">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;