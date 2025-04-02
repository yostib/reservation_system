import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    collection, query, where, onSnapshot,
    writeBatch, doc, getDocs, deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import './Calendar.css';

const Calendar = ({ userId }) => {
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [bookingsThisWeek, setBookingsThisWeek] = useState(0);
    const [loading, setLoading] = useState(true);
    const confirmationDialogRef = useRef(null);
    const [weekDates, setWeekDates] = useState([]);

    // Generate current week dates with actual dates
    const generateWeekDates = () => {
        const dates = [];
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek); // Start from Sunday

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    // Initialize week dates
    useEffect(() => {
        setWeekDates(generateWeekDates());
    }, []);

    // Load all bookings and user bookings
    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        const bookingsRef = collection(db, "bookings");
        const userQ = query(bookingsRef, where("userId", "==", userId));
        const allQ = query(bookingsRef);

        const unsubscribeUser = onSnapshot(userQ, (snapshot) => {
            const userBookingsData = [];
            snapshot.forEach((doc) => {
                userBookingsData.push({ id: doc.id, ...doc.data() });
            });
            setUserBookings(userBookingsData);
            calculateWeeklyBookings(userBookingsData);
        });

        const unsubscribeAll = onSnapshot(allQ, (snapshot) => {
            const allBookingsData = [];
            snapshot.forEach((doc) => {
                allBookingsData.push({ id: doc.id, ...doc.data() });
            });
            setBookings(allBookingsData);
            setLoading(false);
        });

        return () => {
            unsubscribeUser();
            unsubscribeAll();
        };
    }, [userId]);

    // Calculate weekly bookings for the user
    const calculateWeeklyBookings = (bookings) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= startOfWeek;
        });

        // Calculate total hours booked this week
        const totalHours = weeklyBookings.reduce((sum, booking) => {
            return sum + (booking.duration || 1); // Default to 1 hour if duration not set
        }, 0);

        setBookingsThisWeek(totalHours);
    };

    // Check if time is in the past
    const isPastTime = (date, hour) => {
        const now = new Date();
        const slotTime = new Date(date);
        const [hours, minutes] = hour.split(':').map(Number);
        slotTime.setHours(hours, minutes, 0, 0);
        return slotTime < now;
    };

    // Check if slot is booked
    const isSlotBooked = (date, hour) => {
        const slotKey = `${date.toDateString()}-${hour}`;
        return bookings.some(booking => booking.slotKey === slotKey);
    };

    // Handle slot selection
    const handleSlotClick = (date, hour) => {
        if (isPastTime(date, hour)) return;

        const slotKey = `${date.toDateString()}-${hour}`;

        // Check if already booked by someone
        if (isSlotBooked(date, hour)) {
            alert("This time slot is already booked");
            return;
        }

        // Check if already selected
        if (selectedSlots.includes(slotKey)) {
            setSelectedSlots(prev => prev.filter(s => s !== slotKey));
            return;
        }

        // Check weekly booking limit
        if (bookingsThisWeek + selectedSlots.length + 1 > 4) {
            alert("You've reached your weekly booking limit of 4 hours");
            return;
        }

        setSelectedSlots(prev => [...prev, slotKey]);
    };

    // Confirm reservation
    const confirmReservation = async () => {
        try {
            const batch = writeBatch(db);
            const bookingsRef = collection(db, "bookings");

            // First verify all slots are still available
            for (const slotKey of selectedSlots) {
                const [dateStr, time] = slotKey.split('-');
                if (isSlotBooked(new Date(dateStr), time)) {
                    throw new Error(`Time slot ${slotKey} was just booked by someone else`);
                }
            }

            // Create all bookings in batch
            selectedSlots.forEach(slotKey => {
                const [dateStr, time] = slotKey.split('-');
                const bookingRef = doc(bookingsRef);
                batch.set(bookingRef, {
                    slotKey,
                    date: dateStr,
                    time,
                    userId,
                    facility: 'laundry', // or get from props
                    duration: 1, // 1 hour per slot
                    status: 'confirmed',
                    createdAt: serverTimestamp()
                });
            });

            await batch.commit();
            setSelectedSlots([]);
            closeDialog();
            alert("Booking confirmed successfully!");
        } catch (error) {
            console.error("Booking error:", error);
            alert(`Booking failed: ${error.message}`);
        }
    };

    // Cancel a booking
    const cancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await deleteDoc(doc(db, "bookings", bookingId));
            alert("Booking cancelled successfully");
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Failed to cancel booking");
        }
    };

    const openDialog = () => {
        if (selectedSlots.length === 0) {
            alert("Please select at least one time slot");
            return;
        }
        confirmationDialogRef.current.showModal();
    };

    const closeDialog = () => {
        confirmationDialogRef.current.close();
    };

    if (loading) {
        return <div className="loading">Loading calendar data...</div>;
    }

    return (
        <div className="calendar-container">
            <h2>Weekly Booking Calendar</h2>

            <div className="week-navigation">
                <button onClick={() => setWeekDates(generateWeekDates())}>
                    Current Week
                </button>
            </div>

            <div className="booking-info">
                <p>Booked this week: {bookingsThisWeek}/4 hours</p>
                <p>Selected: {selectedSlots.length} hours</p>
            </div>

            <div className="calendar-grid">
                <div className="time-column">
                    <div className="time-header">Time</div>
                    {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(time => (
                        <div key={time} className="time-cell">{time}</div>
                    ))}
                </div>

                {weekDates.map(date => (
                    <div key={date} className="day-column">
                        <div className="day-header">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            <div className="date">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        </div>
                        {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(time => {
                            const slotKey = `${date.toDateString()}-${time}`;
                            const isBooked = isSlotBooked(date, time);
                            const isUserBooked = userBookings.some(b => b.slotKey === slotKey);
                            const isSelected = selectedSlots.includes(slotKey);
                            const isPast = isPastTime(date, time);

                            return (
                                <button
                                    key={time}
                                    className={`time-slot ${
                                        isPast ? 'past' :
                                            isBooked ? (isUserBooked ? 'user-booked' : 'booked') :
                                                isSelected ? 'selected' : ''
                                    }`}
                                    onClick={() => handleSlotClick(date, time)}
                                    disabled={isPast || isBooked}
                                >
                                    {isPast ? 'Past' :
                                        isBooked ? (isUserBooked ? 'Yours' : 'Booked') :
                                            isSelected ? 'Selected' : 'Available'}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <button
                className="reserve-button"
                onClick={openDialog}
                disabled={selectedSlots.length === 0}
            >
                Reserve Selected Slots
            </button>

            <dialog ref={confirmationDialogRef} className="confirmation-dialog">
                <h3>Confirm Your Booking</h3>
                <p>You are about to book:</p>
                <ul>
                    {selectedSlots.map(slot => {
                        const [dateStr, time] = slot.split('-');
                        const date = new Date(dateStr);
                        return (
                            <li key={slot}>
                                {date.toLocaleDateString()} at {time}
                            </li>
                        );
                    })}
                </ul>
                <p>Total hours: {selectedSlots.length} (Weekly total: {bookingsThisWeek + selectedSlots.length}/4 hours)</p>
                <div className="dialog-buttons">
                    <button onClick={closeDialog}>Cancel</button>
                    <button onClick={confirmReservation}>Confirm</button>
                </div>
            </dialog>
        </div>
    );
};

Calendar.propTypes = {
    userId: PropTypes.string.isRequired
};

export default Calendar;