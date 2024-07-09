// src/components/MakeReservation.js
import React, { useState } from "react";
import { db } from "../firebase"; // Adjust the path as needed
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "./MakeReservation.css";

const MakeReservation = () => {
  const [type, setType] = useState("Laundry");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [machineId, setMachineId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setErrorMessage("User not authenticated");
      console.error("User not authenticated");
      return;
    }

    if (!type || !date || !time || (!machineId && !roomNumber)) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const reservationDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();

    if (reservationDateTime <= now) {
      setErrorMessage("Cannot reserve for past times.");
      return;
    }

    try {
      await db.collection("reservations").add({
        userId: user.uid,
        type,
        date,
        time,
        machineId,
        roomNumber,
        timestamp: firebase.firestore.Timestamp.fromDate(reservationDateTime),
      });

      setSuccessMessage("Reservation made successfully!");
      setErrorMessage("");
      setType("Laundry");
      setDate("");
      setTime("");
      setMachineId("");
      setRoomNumber("");
    } catch (error) {
      setErrorMessage("Error making reservation. Please try again.");
      console.error("Error adding reservation: ", error);
    }
  };

  return (
    <div className="container">
      <h2>Make a Reservation</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Reservation Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Laundry">Laundry</option>
            <option value="Sauna">Sauna</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={time}
            min="09:00"
            max="21:00"
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        {type === "Laundry" && (
          <div className="form-group">
            <label>Machine ID:</label>
            <input
              type="text"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
            />
          </div>
        )}
        {type === "Sauna" && (
          <div className="form-group">
            <label>Room Number:</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>
        )}
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
};

export default MakeReservation;
