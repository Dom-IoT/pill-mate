import { FC } from 'react';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './Stock.css';
import { useReminders } from '../context/UseReminder';
import RegisteredObject from '../components/RegisteredObject';
import AddButton from '../components/AddButton';

const Stock: FC = () => {
    const { reminders } = useReminders();

    return (
        <div className="Stock">
            <h1 className="Title">Liste des médicament déjà enregistrés</h1>
            <div className="StockList">
                <div>
                    <AddButton
                        title="Ajouter un médicament"
                        color="green"
                    />
                </div>
                {/* {show && <PopUp onClose={() => setShow(false)}/>} */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {reminders.length > 0 ? (
                        reminders.map((reminder) => (
                            <RegisteredObject
                                key={reminder.id}
                                rappel={reminder.name}
                                color="green"
                                date={reminder.date}
                            />
                        ))
                    ) : (
                        <p>Aucun médicament pour le moment.</p>
                    )}
                </div>
            </div>
            <nav>
                <Link to="/" className="Link">Retour au Tableau de bord</Link>
            </nav>
        </div>
    );
};

export default Stock;
