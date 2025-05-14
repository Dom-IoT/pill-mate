import  { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import AddButton from '../components/AddButton.tsx';
import ReminderCard from '../components/ReminderCard.tsx';
import { useReminders } from '../context/useReminder.ts';
import PopUpCalendar from '../components/PopUpCalendar.tsx';

const Calendar: FC = () => {
    const { reminders } = useReminders();
    const [show, setShow] = useState(false);

    return (
        <div className="Calendar">
            <h1 className="Title">Liste de vos rappels</h1>
            <div className="reminderList">
                <div onClick={() => setShow(true)}>
                    <AddButton
                        title="Ajouter un rappel"
                        color="blue"
                    />
                </div>
                {show && <PopUpCalendar onClose={
                    () => setShow(false)} mode="Ajouter" reminder={null}
                />}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {reminders.length > 0 ? (
                        reminders.map((reminder) => (
                            <ReminderCard
                                reminder={reminder}
                                key={reminder.id}
                                color="blue"
                            />
                        ))
                    ) : (
                        <p>Aucun rappel pour le moment.</p>
                    )}
                </div>
            </div>
            <nav>
                <Link to="/" className="Link">Retour au Tableau de bord</Link>
            </nav>
        </div>
    );
};

export default Calendar;
