import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.log('Firebase Error:', err);  // Add logging for debugging

      const errorCode = err.code;
      console.log('Error Code:', errorCode);  // Log error code to check what Firebase returns

      // Provide custom error messages based on the Firebase error code
      switch (errorCode) {
        case 'auth/invalid-email':
          setError('The email address you entered is not in a valid format. Please check and try again.');
          break;
        case 'auth/user-disabled':
          setError('Your account has been disabled. Please contact support for assistance.');
          break;
        case 'auth/user-not-found':
          setError('No account found for the provided email address. Please check the email or register a new account.');
          break;
        case 'auth/wrong-password':
          setError('The password you entered is incorrect. Please try again or reset your password.');
          break;
        case 'auth/invalid-credential':
          setError('There seems to be an issue with the credentials you entered. Double-check your email and password.');
          break;
        case 'auth/missing-email':
          setError('Please enter your email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later or reset your password.');
          break;
        default:
          setError('An unexpected error occurred. Please try again later or contact support.');
      }
      setLoading(false);
    }
  };

  return (
      <div className="login-root">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label className="login-label">Email:</label>
              <input
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div className="login-form-group">
              <label className="login-label">Password:</label>
              <input
                  type="password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            <button
                type="submit"
                className="login-button"
                disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="login-footer">
            Don't have an account? <a href="/register" className="login-link">Register</a>
          </p>
        </div>
      </div>
  );
}

export default Login;
