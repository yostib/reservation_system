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
        setReservations(querySnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <h2>Reservations</h2>
      <ul>
        {reservations.map((reservation, index) => (
          <li key={index}>
            Date: {reservation.date}, Time: {reservation.time}, Machine: {reservation.machine}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationsList;
