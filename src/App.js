// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
      <Router>
        <Routes>
          <Route
              path="/"
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
              path="/dashboard"
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
          />
          <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
              path="/book/*"  // This handles all booking-related routes
              element={user ? <Calendar /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
  );
};

export default App;