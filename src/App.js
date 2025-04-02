// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading) {
        return <div className="app-loading">Loading app...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                <Route
                    path="/dashboard"
                    element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/book/:facility"
                    element={user ? <Calendar userId={user.uid} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={user ? <Navigate to="/dashboard" /> : <Login />}
                />
                <Route
                    path="/register"
                    element={user ? <Navigate to="/dashboard" /> : <Register />}
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;