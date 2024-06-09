// src/components/ReservationsList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reservations'));
        const reservationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReservations(reservationsList);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <h3>Your Reservations</h3>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            {reservation.date} - {reservation.time} - {reservation.machineId} ({reservation.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationsList;
