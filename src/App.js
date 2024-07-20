// src/App.js
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MakeReservation from './components/ReservationForm';
import OwnReservations from './components/OwnReservations';
import Calendar from "./components/Calendar";
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/own-reservations" className="nav-link">My Reservations</Link>
              <Link to="/reserve" className="nav-link" >Reserve</Link>
              <button className="nav-link" onClick={() => getAuth().signOut()}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Calendar/>}/>
          <Route path="/reserve" element={user ? <MakeReservation /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/own-reservations" element={user ? <OwnReservations /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
