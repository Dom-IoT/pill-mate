import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({ onDateChange }: { onDateChange: (date: Date) => void }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
            onDateChange(date); // Envoie la date au parent
        }
    };

    return (
        <div>
            <h3>Sélectionnez une date</h3>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Sélectionnez une date et une heure"
            />
        </div>
    );
};

export default DateTimePicker;
