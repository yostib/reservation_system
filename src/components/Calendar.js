import * as PropTypes from "prop-types";

const weekDays = ["Mon", "Tus", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hoursOfTheDays = ["09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00"]

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
    console.log(e.target.value)
}

const generateBodyRows = (hour) => {
    return (<tr>
        <td key={hour}>{hour}</td>
        {generateSlots(hour)}
    </tr>)
}

const Calendar = (props) => {
    return (<div>
        <div>The calendar</div>
        <div id="calendar-table-container">
            <table>
                <thead>
                <tr>
                    <th></th>
                    {weekDays.map(generateHeaders)}
                </tr>
                </thead>
                <tbody>
                {hoursOfTheDays.map(generateBodyRows)}
                </tbody>
            </table>
        </div>
    </div>);
}

// practice
// a function called subtraction
// takes two arguments that are numbers
// call it/ use it


Calendar.propTypes = {children: PropTypes.node};

export default Calendar;
