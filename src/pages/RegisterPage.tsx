import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    //reset error
    setError(null);
    
    //form validation
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !zipCode.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    //form submit
    try {
      setLoading(true);
      await register({
        email,
        password,
        zip_code: zipCode,
        budget: budget ? parseFloat(budget) : 0
      });
      
      //direct to home page
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Create an Account</h1>
        
        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code *</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              pattern="[0-9]{5}"
              title="Please enter a valid 5-digit ZIP code"
              className="form-input"
              required
            />
            <small className="form-help">
              We use your ZIP code to find grocery stores near you.
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="budget">Monthly Grocery Budget (optional)</label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="0"
              step="0.01"
              className="form-input"
            />
            <small className="form-help">
              Setting a budget helps you track your spending.
            </small>
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;