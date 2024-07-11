// src/components/MakeReservation.js
import React, {useState} from "react";
import {db} from "../firebase"; // Adjust the path as needed
import firebase from "firebase/compat/app";
import {getAuth} from "firebase/auth";
import "./MakeReservation.css";

const RESERVATION_SAVE_ERROR = "Error making reservation. Please try again.";

const MakeReservation = () => {
    const [type, setType] = useState("Laundry");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [machineId, setMachineId] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const availableSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
        "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
        "21:00"];

    function getUser() {
        const auth = getAuth();
        return auth.currentUser;
    }

    function isFormValid() {
        if (!type || !date || !startTime || !endTime || (!machineId && !roomNumber)) {
            return false;
        }
        return true;
    }

    function getReservationStartDateTime() {
        return new Date(`${date}T${startTime}:00`);
    }

    function getReservationEndDateTime() {
        return new Date(`${date}T${endTime}:00`);
    }

    function isReservationInThePast(reservationDateTime) {
        const now = new Date();
        if (reservationDateTime <= now) {
            return true;
        }
        return false;
    }

    async function addReservationToDB(user, reservationDateTime) {
        return await db.collection("reservations").add({
            userId: user.uid,
            type,
            date,
            startTime: startTime,
            endTime: endTime,
            machineId,
            roomNumber,
            timestamp: firebase.firestore.Timestamp.fromDate(reservationDateTime),
        });
    }

    function resetForm() {
        setErrorMessage("");
        setType("Laundry");
        setDate("");
        setStartTime("");
        setEndTime("");
        setMachineId("");
        setRoomNumber("");
    }

    const onDateChange = (e) => {
        e.preventDefault();
        let value = e.target.value;
        let today = new Date();
        let startDate = new Date(value);
        if( startDate.getTime() < today.getTime() ){
            setErrorMessage("Date cannot be in the past");
        } else {
            setDate(value)
            setErrorMessage("");
        }

    }

    const onStartTimeChange = (e) => {
        e.preventDefault();
        let selectedValue = e.target.value;
        setStartTime(selectedValue);
        let selectedTime = new Date(`${date}T${startTime}:00`);
    }

    const onEndTimeChange = (e) => {
        e.preventDefault();
        let selectedEndTimeValue = e.target.value;

        if (selectedEndTimeValue < startTime){
            setErrorMessage("End time cannot be before start time.");
        } else {
            setEndTime(selectedEndTimeValue);
            setErrorMessage("");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = getUser();

        if (!user) {
            setErrorMessage("User not authenticated");
            console.error("User not authenticated");
            return;
        }

        if(!isFormValid()) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const reservationStartDateTime = getReservationStartDateTime();

        if( isReservationInThePast(reservationStartDateTime) ) {
            setErrorMessage("Cannot reserve for past times.");
            return;
        }

        const reservationEndDateTime = getReservationEndDateTime();

        if( isReservationInThePast(reservationEndDateTime) ) {
            setErrorMessage("Cannot reserve for past times.");
            return;
        }
        try {
            addReservationToDB(user, reservationStartDateTime).then((documentRef) => {
                setSuccessMessage("Reservation made successfully!");
                resetForm();
            }, (reason) => {
                setErrorMessage(RESERVATION_SAVE_ERROR);
                console.error("Error ", reason);
            });
        } catch (error) {
            setErrorMessage(RESERVATION_SAVE_ERROR);
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
                        min={new Date().toISOString().split("T")[0]}
                        onChange={onDateChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation-start-time">Start time:</label>
                    <select
                        id="reservation-start-time"
                        value={startTime}
                        onChange={onStartTimeChange}
                    >
                        <option value="">Select a time slot</option>
                        {availableSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="reservation-end-time">End time:</label>
                    <select
                        id="reservation-end-time"
                        value={endTime}
                        onChange={onEndTimeChange}
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
