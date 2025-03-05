import { FC, useState } from 'react';
import './PopUp.css';
import { CircleX } from 'lucide-react';
import { useReminders } from '../context/UseReminder.tsx';
import DateTimePicker from './DateTimePicker.tsx';

interface Props {
    onClose: () => void;
}

const PopUp: FC<Props> = ({ onClose }) => {
    const { addReminder } = useReminders();
    const [name, setName] = useState('');
    const [date, setDate] = useState<Date | null>(null);

    const handleSubmit = () => {
        if (name && date) {
            addReminder(name, date);
        }
    };

    return (
        <div className="Screen" onClick={onClose}>
            <div className="PopUp" onClick={(e) => e.stopPropagation()}>
                <h2>Créer un rappel</h2>
                <CircleX size={24} className="crossIcon" onClick={onClose}/>
                <input
                    type="text"
                    placeholder='Nom du rappel'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="Settings">
                    <DateTimePicker onDateChange={setDate} />
                    <button onClick={() => {handleSubmit(); onClose();}}>Ajouter</button>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
