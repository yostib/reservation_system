// src/components/Dashboard.js
import React from 'react';
import ReservationForm from './ReservationForm';
import OwnReservations from './OwnReservations';

const Dashboard = () => {
  return (
    <div>
      <h2>Welcome to the Dashboard!</h2>
      <ReservationForm />
      <OwnReservations />
    </div>
  );
};

export default Dashboard;
