import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './UserProfilePage.css';

const UserProfilePage: React.FC = () => {
  const { authState } = useAuth();
  const { isAuthenticated, user } = authState;
  
  return (
    <div className="user-profile-page">
      <h1>My Profile</h1>
      
      {isAuthenticated && user ? (
        <div className="profile-container">
          <div className="profile-section">
            <h2>Account Info</h2>
            <div className="profile-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{user.email}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">ZIP Code:</span>
              <span className="field-value">{user.zip_code}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Monthly Budget:</span>
              <span className="field-value">${user.budget.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="edit-profile-btn">
              Edit Profile
            </button>
            <button className="change-password-btn">
              Change Password
            </button>
          </div>
          
          <div className="profile-section">
            <h2>Preferences</h2>
            <p className="under-construction-text">
              Preferences coming soon
            </p>
          </div>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please log in to view and manage your profile.</p>
          <Link to="/login" className="login-button">
            Log In
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;