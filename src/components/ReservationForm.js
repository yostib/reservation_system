// src/components/MakeReservation.js
import React, {useState} from "react";
import {db} from "../firebase"; // Adjust the path as needed
import firebase from "firebase/compat/app";
import {getAuth} from "firebase/auth";
import "./MakeReservation.css";

const MakeReservation = () => {
    const [type, setType] = useState("Laundry");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [machineId, setMachineId] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const availableSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
        "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
        "21:00"];

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
                    <label htmlFor="reservation-time">Time:</label>
                    <select
                        id="reservation-time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    >
                        <option value="">Select a time slot</option>
                        {availableSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                        ))}
                    </select>
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
