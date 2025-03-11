import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TimePicker.css';

interface TimePickerProps {
    onHourChange: (heurePrise: Date) => void;
    actualHour: Date | null;
}

const TimePicker = ({ onHourChange, actualHour }: TimePickerProps) => {

    const [selectedDate, setSelectedDate] = useState<Date | null>(actualHour);

    const handleDateChange = (heurePrise: Date | null) => {
        if (heurePrise) {
            setSelectedDate(heurePrise);
            onHourChange(heurePrise); // Envoie la date au parent
        }
    };

    return (
        <div className="TimePicker">
            <h3>Sélectionnez l'heure de prise du médicament</h3>
            <DatePicker
                required={true}
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                showTimeSelectOnly
                placeholderText="Heure de prise"
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="HH:mm"
                className="customTimePicker"
            />
        </div>
    );
};

export default TimePicker;
