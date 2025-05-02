import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './UserProfilePage.css';

const UserProfilePage: React.FC = () => {
  const { authState, updateProfile } = useAuth();
  const { isAuthenticated, user, loading: authLoading } = authState;
  const navigate = useNavigate();

  // local form state
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [zipCode, setZipCode] = useState(user?.zip_code || '');
  const [budget, setBudget] = useState(user?.budget.toString() || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // when user loads or updates, populate form fields
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setZipCode(user.zip_code);
      setBudget(user.budget.toString());
    }
  }, [user]);

  const handleSave = async () => {
    setError(null);

    // basic validation
    if (!email.trim() || !zipCode.trim()) {
      setError('Email and ZIP Code cannot be empty.');
      return;
    }
    if (!/^\d{5}$/.test(zipCode)) {
      setError('ZIP Code must be 5 digits.');
      return;
    }
    if (isNaN(Number(budget)) || Number(budget) < 0) {
      setError('Budget must be a non-negative number.');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        email,
        zip_code: zipCode,
        budget: parseFloat(budget)
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // revert edits
    if (user) {
      setEmail(user.email);
      setZipCode(user.zip_code);
      setBudget(user.budget.toString());
    }
    setError(null);
    setIsEditing(false);
  };

  if (authLoading) {
    return <div className="user-profile-page"><p>Loading...</p></div>;
  }

  return (
    <div className="user-profile-page">
      <h1>My Profile</h1>

      {isAuthenticated && user ? (
        <div className="profile-container">
          {/* Account Info Section */}
          <div className="profile-section">
            <h2>Account Info</h2>

            {isEditing ? (
              <>
                <div className="profile-field">
                  <span className="field-label">Email:</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="field-value"
                  />
                </div>
                <div className="profile-field">
                  <span className="field-label">ZIP Code:</span>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value)}
                    pattern="\d{5}"
                    className="field-value"
                  />
                </div>
                <div className="profile-field">
                  <span className="field-label">Monthly Budget:</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="field-value"
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="profile-actions">
                  <button
                    className="edit-profile-btn"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    className="change-password-btn"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
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
                  <span className="field-value">
                    ${user.budget.toFixed(2)}
                  </span>
                </div>

                <div className="profile-actions">
                  <button
                    className="edit-profile-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="change-password-btn"
                    onClick={() => navigate('/change-password')}
                  >
                    Change Password
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Preferences Section */}
          <div className="profile-section">
            <h2>Preferences</h2>
            <p className="under-construction-text">
              Preferences coming soon.
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
