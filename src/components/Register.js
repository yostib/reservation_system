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
  const [showPassword, setShowPassword] = useState(false); // New state to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state to toggle confirm password visibility
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
      // Register the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await user.sendEmailVerification(); // Send the verification email

      // Add user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        createdAt: new Date(),
        role: "user"
      });

      setSuccess('Registration successful! Verification email sent. Check your inbox.');
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
              <div className="password-container">
                <input
                    id="password"
                    type={showPassword ? 'text' : 'password'} // Toggle between text and password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="At least 6 characters"
                    disabled={loading}
                />
                <button
                    type="button"
                    className="show-password-button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="password-container">
                <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    placeholder="Re-enter your password"
                    disabled={loading}
                />
                <button
                    type="button"
                    className="show-password-button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle showConfirmPassword state
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
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
