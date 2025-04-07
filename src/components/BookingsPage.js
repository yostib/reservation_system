import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { FaTshirt, FaHotTub, FaClock, FaArrowLeft } from 'react-icons/fa';
import Loader from './Loader';
import './BookingsPage.css';

const BookingsPage = ({ user }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.uid) {
            navigate('/login');
            return;
        }

        const q = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid),
            where("status", "==", "confirmed")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const now = new Date();
                const upcoming = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(b => new Date(`${b.date} ${b.time}`) > now);

                setBookings(upcoming);
                setLoading(false);
            },
            (error) => {
                console.error("Firestore error:", error);
                setError("Failed to load bookings. Please try again.");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user, navigate]);

    if (loading) return <Loader fullPage={true} />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="bookings-page">
            <header className="bookings-header">
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    <FaArrowLeft /> Back to Dashboard
                </button>
                <h1>Your Upcoming Bookings</h1>
            </header>

            <div className="bookings-list">
                {bookings.length === 0 ? (
                    <div className="no-bookings">
                        <p>You have no upcoming bookings.</p>
                        <Link to="/dashboard" className="book-now-link">
                            Book a Facility Now
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="bookings-list-header">
                            <span>Facility</span>
                            <span>Date & Time</span>
                            <span>Status</span>
                        </div>
                        {bookings.map(booking => (
                            <div key={booking.id} className="booking-item">
                                <div className="facility-info">
                                    {booking.facility === 'laundry' ? <FaTshirt /> : <FaHotTub />}
                                    <span>{booking.facility.charAt(0).toUpperCase() + booking.facility.slice(1)}</span>
                                </div>
                                <div className="booking-time">
                                    {new Date(booking.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })} at {booking.time}
                                </div>
                                <div className="booking-status">
                                    <FaClock className="upcoming-icon" />
                                    <span>Upcoming</span>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingsPage;
