import * as PropTypes from "prop-types";
import {useRef, useState} from "react";

const Calendar = (props) => {
    const confirmationDialogRef = useRef(null);
    const [selected, setSelected] = useState([]);

    const weekDays = ["Mon", "Tus", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const hoursOfTheDays = ["09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
        "20:00"]

    const generateHeaders = (day) => {
        return (<th key={day}>{day}</th>)
    }

    const generateSlots = (hour) => {
        return weekDays.map((day) => {
            return (
                <td>
                    <button key={`${day}-${hour}`} value={`${day}-${hour}`} onClick={setReserved}>Available</button>
                </td>
            )
        })
    }

    const setReserved = (e) => {
        let currentClassName = e.target.className;
        switch (currentClassName) {
            case "slot-selected":
                e.target.className = "slot-deselected";
                e.target.innerHTML = "Available"
                break;
            case "":
                e.target.className = "slot-selected";
                e.target.innerHTML = "Selected"
                break;
            case "slot-deselected":
                e.target.className = "slot-selected";
                e.target.innerHTML = "Selected"
                break;
            default:
                break;
        }
    }

    const generateBodyRows = (hour) => {
        return (<tr>
            <td key={hour}>{hour}</td>
            {generateSlots(hour)}
        </tr>)
    }

    const showConfirmationDialog = (e) => {
        console.log("Dialog!")
        confirmationDialogRef.current.showModal();
    }

    function reserveConfirmed() {
        console.log("Reservation sent to the server");
        closeDialog();
    }

    function closeDialog() {
        confirmationDialogRef.current.close();
    }

    return (<div>
        <div id="calendar-table-container">
            <div className="form-group">
                <table>
                    <thead>
                    <tr>
                        <th>Start Time</th>
                        {weekDays.map(generateHeaders)}
                    </tr>
                    </thead>
                    <tbody>
                    {hoursOfTheDays.map(generateBodyRows)}
                    </tbody>
                </table>
            </div>
            <div className="form-group">
                <button className="reserve-button" onClick={showConfirmationDialog}>Reserve</button>
            </div>
        </div>
        <div id="dialog-container" className="dialog-container">
            <dialog ref={confirmationDialogRef}>
                <div>
                   Ready for booking !
                </div>
                <div className="dialog-button-container">
                    <button className="secondary-button dialog-button" onClick={closeDialog}>Cancel</button>
                    <button className="primary-button dialog-button" onClick={reserveConfirmed}>Confirm</button>
                </div>
            </dialog>
        </div>

    </div>);
}

Calendar.propTypes = {children: PropTypes.node};

export default Calendar;
