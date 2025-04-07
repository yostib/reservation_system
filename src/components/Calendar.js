import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    collection, query, where, getDocs, writeBatch, doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import Loader from './Loader';
import './Calendar.css';

const HOURS = Array.from({ length: 13 }, (_, i) => 8 + i); // 8:00 to 20:00

const Calendar = ({ user }) => {
    const navigate = useNavigate();
    const [facility, setFacility] = useState('laundry');
    const [bookings, setBookings] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weekOffset, setWeekOffset] = useState(0);
    const [weeklyUserHours, setWeeklyUserHours] = useState(0);

    const FACILITY_LIMIT = facility === 'laundry' ? 4 : 1;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                setLoading(true);
                const q = query(
                    collection(db, "bookings"),
                    where("facility", "==", facility),
                    where("status", "==", "confirmed")
                );

                const querySnapshot = await getDocs(q);
                const bookingsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setBookings(bookingsData);
                setError(null);

                const userBookingsThisWeek = getUserWeeklyHours(bookingsData);
                setWeeklyUserHours(userBookingsThisWeek);
            } catch (err) {
                console.error("Firestore error:", err);
                setError("Failed to load availability. Please refresh and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, facility, navigate]);

    const getWeekDates = () => {
        const start = new Date();
        start.setDate(start.getDate() + weekOffset * 7);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return date;
        });
    };

    const getUserWeeklyHours = (data = bookings) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        return data.filter(b =>
            b.userId === user.uid &&
            b.facility === facility &&
            new Date(b.date) >= startOfWeek
        ).length;
    };

    const handleSlotClick = (date, hour) => {
        const slotKey = `${date.toDateString()}-${hour}`;
        const isBooked = bookings.some(booking => booking.slotKey === slotKey);
        const alreadySelected = selectedSlots.some(slot => slot.slotKey === slotKey);

        if (isBooked || alreadySelected) return;

        const totalAfterSelect = weeklyUserHours + selectedSlots.length;

        if (totalAfterSelect >= FACILITY_LIMIT) {
            alert(`You can only book ${FACILITY_LIMIT} hour(s) per week for ${facility}.`);
            return;
        }

        setSelectedSlots(prev => [...prev, { date, hour, slotKey }]);
    };

    const confirmBooking = async () => {
        try {
            const batch = writeBatch(db);

            selectedSlots.forEach(slot => {
                const bookingRef = doc(collection(db, "bookings"));
                batch.set(bookingRef, {
                    slotKey: slot.slotKey,
                    date: slot.date.toDateString(),
                    time: `${slot.hour}:00`,
                    userId: user.uid,
                    facility,
                    duration: 1,
                    status: 'confirmed',
                    createdAt: serverTimestamp()
                });
            });

            await batch.commit();
            alert("Booking confirmed!");
            setSelectedSlots([]);
            navigate('/bookings');
        } catch (err) {
            console.error("Booking error:", err);
            alert(`Booking failed: ${err.message}`);
        }
    };

    if (loading) return <Loader fullPage={true} />;
    if (error) return <div className="error-message">{error}</div>;

    const weekDates = getWeekDates();
    const progress = ((weeklyUserHours + selectedSlots.length) / FACILITY_LIMIT) * 100;

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h2>Book {facility}</h2>
                <select
                    value={facility}
                    onChange={(e) => {
                        setFacility(e.target.value);
                        setSelectedSlots([]);
                    }}
                    className="facility-select"
                >
                    <option value="laundry">Laundry Room</option>
                    <option value="sauna">Sauna</option>
                </select>
                <div className="week-navigation">
                    <button onClick={() => setWeekOffset(prev => prev - 1)}>← Previous</button>
                    <button onClick={() => setWeekOffset(prev => prev + 1)}>Next →</button>
                </div>
            </div>

            <div className="progress-wrapper">
                <label>{weeklyUserHours + selectedSlots.length} / {FACILITY_LIMIT} hour(s) used this week</label>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="calendar-grid">
                {weekDates.map((date, i) => (
                    <div key={i} className="calendar-day">
                        <h3>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                        {HOURS.map(hour => {
                            const slotKey = `${date.toDateString()}-${hour}`;
                            const isBooked = bookings.some(b => b.slotKey === slotKey);
                            const isSelected = selectedSlots.some(s => s.slotKey === slotKey);

                            return (
                                <button
                                    key={hour}
                                    className={`time-slot ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSlotClick(date, hour)}
                                    disabled={isBooked}
                                >
                                    {hour}:00
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {selectedSlots.length > 0 && (
                <div className="booking-summary">
                    <h3>Selected Slots:</h3>
                    <ul>
                        {selectedSlots.map((slot, i) => (
                            <li key={i}>
                                {slot.date.toLocaleDateString()} at {slot.hour}:00
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={confirmBooking}
                        className="confirm-button"
                    >
                        Confirm Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default Calendar;
