import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Adjust the path as needed
import { getAuth } from "firebase/auth";
//import "./ReservationsList.css";

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setErrorMessage("User not authenticated");
      return;
    }

    const fetchReservations = async () => {
      try {
        const querySnapshot = await db
          .collection("reservations")
          .where("userId", "==", user.uid)
          .get();

        const reservationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out past reservations
        const now = new Date();
        const filteredReservations = reservationsData.filter(
          (reservation) =>
            new Date(`${reservation.date}T${reservation.time}:00`) > now
        );

        setReservations(filteredReservations);
      } catch (error) {
        setErrorMessage("Error fetching reservations. Please try again.");
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="reservations-container">
      <h2>Your Reservations</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            <p>Type: {reservation.type}</p>
            <p>Date: {reservation.date}</p>
            <p>Time: {reservation.time}</p>
            {reservation.type === "Laundry" ? (
              <p>Machine ID: {reservation.machineId}</p>
            ) : (
              <p>Room Number: {reservation.roomNumber}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationsList;
