// src/components/ReservationForm.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ReservationForm = () => {
  const [reservationType, setReservationType] = useState('laundry');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [machineId, setMachineId] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReservation = {
        type: reservationType,
        date,
        time,
        machine: reservationType === 'laundry' ? machineId : '',
        room: reservationType === 'sauna' ? roomId : ''
      };
      await addDoc(collection(db, 'reservations'), newReservation);
      alert('Reservation made successfully!');
    } catch (error) {
      console.error('Error adding reservation: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Make a Reservation</h3>
      <label>
        Reservation Type:
        <select
          value={reservationType}
          onChange={(e) => setReservationType(e.target.value)}
        >
          <option value="laundry">Laundry</option>
          <option value="sauna">Sauna</option>
        </select>
      </label>
      <div>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
      </div>
      {reservationType === 'laundry' && (
        <div>
          <label>
            Machine ID:
            <input
              type="text"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              required
            />
          </label>
        </div>
      )}
      {reservationType === 'sauna' && (
        <div>
          <label>
            Room ID:
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            />
          </label>
        </div>
      )}
      <button type="submit">Reserve</button>
    </form>
  );
};

export default ReservationForm;
