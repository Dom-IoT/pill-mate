import { FC, useState } from 'react';
import './ReminderCard.css';
import { Reminder } from '../context/ReminderContext.tsx';
import PopUp from './PopUp.tsx';

interface Props {
    reminder: Reminder,
    color:'blue' | 'green' | 'red' | 'orange',
};

const ReminderCard: FC<Props> = ({reminder, color }) => {
    const [show, setShow] = useState(false);
    // eslint-disable-next-line no-console
    console.log('Données reçues par ReminderCard :', reminder);

    return (
        <div className={`ReminderBar ${color}`}>
            <div>
                <p>{reminder.name}</p>
                <p>Prendre tous les{
                    reminder.frequence === 1 ? '' : ' ' + reminder.frequence
                } jours à {
                    reminder.heurePrise.toLocaleTimeString()
                }</p>
            </div>
            <div className="button" onClick={() => setShow(true)}>Modifier</div>
            {show && <PopUp onClose={() => setShow(false)} mode="Modifier" reminder={reminder}/>}
        </div>
    );
};

export default ReminderCard;
