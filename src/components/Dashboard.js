import { useNavigate } from 'react-router-dom';
import { FaTshirt, FaHotTub, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Dashboard.css';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();

    const handleBookNow = (facility) => {
        if (!user) return;
        navigate('/calendar', {
            state: {
                facility,
                userId: user.uid
            }
        });
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleViewBookings = () => {
        navigate('/bookings');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-welcome">
                    <h1>Welcome, {user?.email?.split('@')[0] || 'User'}!</h1>
                </div>
                <div className="header-buttons">
                    <button onClick={handleViewBookings} className="view-bookings-button">
                        <FaCalendarAlt /> View Bookings
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            <div className="facility-selection">
                <h2>Select a Facility to Book</h2>
                <div className="facility-options">
                    <div className="facility-card" onClick={() => handleBookNow('laundry')}>
                        <FaTshirt size={48} />
                        <h3>Laundry Room</h3>
                        <p>Book a time slot for washing clothes</p>
                    </div>
                    <div className="facility-card" onClick={() => handleBookNow('sauna')}>
                        <FaHotTub size={48} />
                        <h3>Sauna</h3>
                        <p>Reserve time for relaxation</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;