import * as PropTypes from "prop-types";

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

const Calendar = (props) => {
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
                <button className="reserve-button">Reserve</button>
            </div>
        </div>

    </div>);
}

// practice
// a function called subtraction
// takes two arguments that are numbers
// call it/ use it


Calendar.propTypes = {children: PropTypes.node};

export default Calendar;
