// src/components/BookingsPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { FaTshirt, FaHotTub, FaCheck, FaClock, FaArrowLeft } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import './BookingsPage.css';

const BookingsPage = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    const bookingsRef = collection(db, "bookings");
    const q = query(
        bookingsRef,
        where("userId", "==", user.uid),
        where("date", ">=", now.toISOString().split('T')[0]),
        where("date", "<=", oneMonthFromNow.toISOString().split('T')[0]),
        orderBy("date"),
        orderBy("time")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setBookings([]);
      } else {
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          status: getBookingStatus(doc.data().date, doc.data().time)
        }));
        setBookings(bookingsData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getBookingStatus = (date, time) => {
    const bookingDateTime = new Date(`${date}T${time}`);
    return bookingDateTime < new Date() ? 'passed' : 'upcoming';
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
      <div className="bookings-page">
        <header className="bookings-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>Your Bookings</h1>
        </header>

        {loading ? (
            <div className="loading-state">
              <ThreeDots color="#4CAF50" height={50} width={50} />
              <p>Loading your bookings...</p>
            </div>
        ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found for the next month.</p>
            </div>
        ) : (
            <div className="bookings-list">
              <div className="bookings-list-header">
                <span>Facility</span>
                <span>Date & Time</span>
                <span>Status</span>
              </div>
              {bookings.map(booking => (
                  <div key={booking.id} className={`booking-item ${booking.status}`}>
                    <div className="facility-info">
                      {booking.facility === 'laundry' ? <FaTshirt /> : <FaHotTub />}
                      <span>{booking.facility.charAt(0).toUpperCase() + booking.facility.slice(1)}</span>
                    </div>
                    <div className="booking-time">
                      {formatDate(booking.date)} at {booking.time}
                    </div>
                    <div className="booking-status">
                      {booking.status === 'upcoming' ? (
                          <FaClock className="upcoming-icon" />
                      ) : (
                          <FaCheck className="passed-icon" />
                      )}
                      <span>{booking.status === 'passed' ? 'Completed' : 'Upcoming'}</span>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default BookingsPage;