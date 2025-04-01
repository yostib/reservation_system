// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import './Dashboard.css';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [reservations, setReservations] = useState([]);
    const auth = getAuth();

    // Sample reservation data - replace with your actual data fetching
    useEffect(() => {
        const sampleReservations = [
            { id: 1, facility: 'Laundry', date: '2023-11-20', time: '14:00 - 16:00' },
            { id: 2, facility: 'Sauna', date: '2023-11-22', time: '18:00 - 19:00' }
        ];
        setReservations(sampleReservations);
    }, []);

    const handleLogout = () => {
        signOut(auth).then(() => navigate('/login'));
    };

    return (
        <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="dashboard-header">
                <div className="header-controls">
                    <button
                        className="dark-mode-toggle"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>

                <h1>Welcome back, <span className="user-email">{user?.email || 'Guest'}</span>!</h1>
                <p className="welcome-message">What would you like to book today?</p>
            </div>

            <div className="booking-options">
                <div className="option-card" onClick={() => navigate('/book/laundry')}>
                    <div className="option-icon">🧺</div>
                    <h3>Laundry Room</h3>
                    <p>Book a time slot for washing</p>
                    <button className="book-button">Book Now</button>
                </div>

                <div className="option-card" onClick={() => navigate('/book/sauna')}>
                    <div className="option-icon">🧖</div>
                    <h3>Sauna</h3>
                    <p>Reserve your relaxation time</p>
                    <button className="book-button">Book Now</button>
                </div>
            </div>

            <div className="recent-bookings">
                <h3>Your Upcoming Reservations</h3>
                {reservations.length > 0 ? (
                    <ul className="reservation-list">
                        {reservations.map(res => (
                            <li key={res.id} className="reservation-item">
                <span className="facility-icon">
                  {res.facility === 'Laundry' ? '🧺' : '🧖'}
                </span>
                                <div className="reservation-details">
                                    <span className="facility-name">{res.facility}</span>
                                    <span className="reservation-time">{res.date} • {res.time}</span>
                                </div>
                                <button
                                    className="cancel-button"
                                    onClick={() => console.log('Cancel reservation', res.id)}
                                >
                                    Cancel
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-reservations">You have no upcoming reservations</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;