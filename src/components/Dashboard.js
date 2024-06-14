// src/components/Dashboard.js
import React from 'react';
import ReservationForm from './ReservationForm';
import ReservationsList from './ReservationsList';

const Dashboard = () => {
  return (
    <div>
      <h2>Welcome to the Reservations!</h2>
      <ReservationForm />
      <ReservationsList />
    </div>
  );
};

export default Dashboard;
