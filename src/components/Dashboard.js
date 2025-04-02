// src/components/Dashboard.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    query,
    where,
    onSnapshot,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import './Dashboard.css';

const Dashboard = ({ user }) => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.uid) {
            navigate('/login');
            return;
        }

        const q = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid),
            where("date", ">=", new Date().toISOString().split('T')[0])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const bookings = [];
            snapshot.forEach((doc) => {
                bookings.push({ id: doc.id, ...doc.data() });
            });
            setUpcomingBookings(bookings);
            setLoadingBookings(false);
        });

        return () => unsubscribe();
    }, [user?.uid, navigate]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const cancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await deleteDoc(doc(db, "bookings", bookingId));
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Failed to cancel booking");
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user?.email || 'User'}!</h1>
                <button onClick={handleLogout} className="logout-button">
                    Log Out
                </button>
            </div>

            <div className="facility-selection">
                <h2>Select a Facility to Book</h2>
                <div className="facility-options">
                    <div className="facility-card" onClick={() => navigate('/book/laundry')}>
                        <h3>Laundry Room</h3>
                        <button className="book-button">Book Now</button>
                    </div>
                    <div className="facility-card" onClick={() => navigate('/book/sauna')}>
                        <h3>Sauna</h3>
                        <button className="book-button">Book Now</button>
                    </div>
                </div>
            </div>

            <div className="bookings-section">
                <h2>Your Upcoming Reservations</h2>
                {loadingBookings ? (
                    <p>Loading your bookings...</p>
                ) : upcomingBookings.length === 0 ? (
                    <p>You have no upcoming reservations</p>
                ) : (
                    <div className="bookings-list">
                        {upcomingBookings.map(booking => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-info">
                                    <h3>{booking.facility === 'laundry' ? 'Laundry Room' : 'Sauna'}</h3>
                                    <p>{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                                    <p>Status: {booking.status}</p>
                                </div>
                                <button
                                    onClick={() => cancelBooking(booking.id)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;