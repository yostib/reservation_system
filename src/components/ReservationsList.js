import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        console.log("Fetching reservations...");
        const q = query(collection(db, "reservations"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const reservationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Reservations fetched: ", reservationsData);
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <h2>Your Reservations</h2>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            {reservation.reservationType} on {reservation.date} at {reservation.time} (Machine ID: {reservation.machineId})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationsList;
