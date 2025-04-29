import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Grocery Price Tracker</h3>
          <p className="footer-description">
            Compare prices!
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/price-trends">Price Trends</Link>
            </li>
            <li>
              <Link to="/shopping-lists">Shopping Lists</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Stores</h3>
          <ul className="footer-links">
            <li>
              <Link to="/products?store=target">Target</Link>
            </li>
            <li>
              <Link to="/products?store=frys">Frys</Link>
            </li>
            <li>
              <Link to="/products?store=amazon">Amazon</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Categories</h3>
          <ul className="footer-links">
            <li>
              <Link to="/products?category=dairy">Dairy</Link>
            </li>
            <li>
              <Link to="/products?category=produce">Produce</Link>
            </li>
            <li>
              <Link to="/products?category=meat">Meat</Link>
            </li>
            <li>
              <Link to="/products?category=dry">Dry Goods</Link>
            </li>
            {/*can add more categories dtl*/}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} ASU CSE412 Group 21 | Local Grocery Price Tracker
        </p>
        <p className="footer-credits">
          GROUP 21: Kushagra Pandey, Thai Nguyen, Isabella Swanson, Theren White
        </p>
      </div>
    </footer>
  );
};

export default Footer;