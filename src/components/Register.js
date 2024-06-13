// src/components/Register.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      setSuccessMessage('Registration successful!');
      setTimeout(() => {
        navigate('/login'); // or '/dashboard' based on your flow
      }, 2000); // Adjust the timeout duration as needed
    } catch (error) {
      console.error("Error registering: ", error.message);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;
