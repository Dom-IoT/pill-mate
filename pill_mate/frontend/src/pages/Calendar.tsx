import  { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import AddButton from '../components/AddButton.tsx';
import RegisteredObject from '../components/RegisteredObject.tsx';
import { useReminders } from '../context/UseReminder.tsx';
import PopUp from '../components/PopUp.tsx';

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
                {show && <PopUp onClose={() => setShow(false)} mode="Ajouter" reminder={null} />}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {reminders.length > 0 ? (
                        reminders.map((reminder) => (
                            <RegisteredObject
                                key={reminder.id}
                                rappel={reminder.name}
                                color="blue"
                                date={reminder.date}
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
