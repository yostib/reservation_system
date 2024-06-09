// src/components/ReservationForm.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ReservationForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [machineId, setMachineId] = useState('');
  const [type, setType] = useState('laundry');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'reservations'), {
        date,
        time,
        machineId,
        type,
      });
      setDate('');
      setTime('');
      setMachineId('');
      setType('laundry');
      alert('Reservation made successfully!');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Error making reservation.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Make a Reservation</h3>
      <label>
        Reservation Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="laundry">Laundry</option>
          <option value="sauna">Sauna</option>
        </select>
      </label>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        Time:
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </label>
      <label>
        Machine ID:
        <input
          type="text"
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
          required
        />
      </label>
      <button type="submit">Reserve</button>
    </form>
  );
};

export default ReservationForm;
