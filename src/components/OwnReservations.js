// src/components/OwnReservations.js
import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../firebase';
import './OwnReservations.css';
import { useNavigate } from 'react-router-dom';

const OwnReservations = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      const snapshot = await db
        .collection('reservations')
        .where('userId', '==', user.uid)
        .get();

      const userReservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReservations(userReservations.filter(reservation => {
        const now = new Date();
        const reservationTime = new Date(`${reservation.date}T${reservation.time}`);
        return reservationTime > now;
      }));
    };

    fetchReservations();
  }, [navigate]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>My Reservations</h2>
      <div className="reservation-list">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-item">
              <p>Type: {reservation.type}</p>
              <p>Date: {reservation.date}</p>
              <p>Time: {reservation.time}</p>
              {reservation.type === 'Laundry' && <p>Machine ID: {reservation.machineId}</p>}
              {reservation.type === 'Sauna' && <p>Room Number: {reservation.roomNumber}</p>}
            </div>
          ))
        ) : (
          <p>No upcoming reservations</p>
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default OwnReservations;
