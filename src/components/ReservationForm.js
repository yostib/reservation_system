// src/components/ReservationForm.js
import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

const ReservationForm = () => {
  const [reservationType, setReservationType] = useState('Laundry');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [machineId, setMachineId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "reservations"), {
        reservationType,
        date,
        time,
        machineId,
        userId: auth.currentUser.uid
      });
      alert('Reservation made successfully!');
    } catch (error) {
      console.error("Error adding reservation: ", error);
      alert('Error making reservation.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Make a Reservation</h2>
      <label>
        Reservation Type:
        <select value={reservationType} onChange={(e) => setReservationType(e.target.value)}>
          <option value="Laundry">Laundry</option>
          <option value="Sauna">Sauna</option>
        </select>
      </label>
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>
        Time:
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </label>
      <label>
        Machine ID:
        <input type="text" value={machineId} onChange={(e) => setMachineId(e.target.value)} required />
      </label>
      <button type="submit">Reserve</button>
    </form>
  );
};

export default ReservationForm;
