import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        createdAt: new Date(),
        role: "user"
      });

      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      let errorMessage = error.message.replace('Firebase: ', '');
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Create Account</h2>

          {error && (
              <div className="register-alert error">
                <span className="alert-icon">!</span>
                <p>{error}</p>
              </div>
          )}

          {success && (
              <div className="register-alert success">
                <span className="alert-icon">✓</span>
                <p>{success}</p>
              </div>
          )}

          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="your@email.com"
                  disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="At least 6 characters"
                  disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Re-enter your password"
                  disabled={loading}
              />
            </div>

            <button
                type="submit"
                className="register-button"
                disabled={loading}
            >
              {loading ? (
                  <span className="button-loader"></span>
              ) : 'Register'}
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login" className="register-link">Sign in</Link></p>
          </div>
        </div>
      </div>
  );
};

export default Register;