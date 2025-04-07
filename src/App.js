import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import BookingsPage from './components/BookingsPage';
import Loader from './components/Loader';

import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthChecked(true);
        });
        return unsubscribe;
    }, []);

    const ProtectedRoute = ({ children }) => {
        if (!authChecked) return <Loader fullPage={true} />;
        return user ? children : <Navigate to="/login" replace />;
    };

    const AuthRoute = ({ children }) => {
        if (!authChecked) return <Loader fullPage={true} />;
        return !user ? children : <Navigate to="/dashboard" replace />;
    };

    return (
        <Router>
            {/* ToastContainer globally available */}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
            <Routes>
                <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar user={user} /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><BookingsPage user={user} /></ProtectedRoute>} />
                <Route
                    path="/"
                    element={
                        authChecked ? (
                            <Navigate to={user ? "/dashboard" : "/login"} replace />
                        ) : (
                            <Loader fullPage={true} />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
