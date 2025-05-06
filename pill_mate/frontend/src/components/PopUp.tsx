import { FC, FormEvent, useState } from 'react';
import './PopUp.css';
import { CircleX, Trash2 } from 'lucide-react';
import { Reminder } from '../context/ReminderContext.tsx';
import { useReminders } from '../context/UseReminder.tsx';
import TimePicker from './TimePicker.tsx';

interface Props {
    onClose: () => void;
    mode: 'Ajouter' | 'Modifier';
    reminder: Reminder | null;
}

const PopUp: FC<Props> = ({ onClose, mode, reminder }) => {
    const { addReminder, modifyReminder, delReminder } = useReminders();

    const [name, setName] = useState(reminder === null ? '' : reminder.name);
    const [heurePrise, setHeurePrise] = useState<Date | null>(
        reminder === null ? null : reminder.heurePrise,
    );
    const [frequence, setFrequence] = useState(reminder === null ? 1 : reminder.frequence);


    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (name && heurePrise && frequence) {
            if (mode === 'Modifier' && reminder !== null) {
                modifyReminder(reminder, name, heurePrise, frequence);
                onClose();
            } else {
                addReminder(name, heurePrise, frequence);
                onClose();
            }

        }
    };

    return (
        <div className="Screen">
            <form className="PopUp" onSubmit={handleSubmit}>
                <h2>{mode === 'Ajouter' ? 'Créer un rappel' : 'Modifier le rappel'}</h2>
                <button
                    type="button"
                    title="Fermer la PopUp"
                    onClick={onClose} className="crossIcon">
                    <CircleX size={24}/>
                </button>
                <div className="title">Nom du rappel</div>
                <input
                    type="text"
                    required= {true}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom du rappel"
                />
                <div className="title">Fréquence du rappel</div>
                <input
                    type="number"
                    required= {true}
                    value={frequence}
                    placeholder="Fréquence du rappel"
                    min={1}
                    onChange={(e) => setFrequence(parseInt(e.target.value))}
                />
                <p className="description">(1 pour tous les jours, 2 pour tous les 2 jours, ...)</p>
                <div className="Settings">
                    <TimePicker
                        onHourChange={(heure) => setHeurePrise(heure)}
                        actualHour={heurePrise}
                    />
                    <button type="submit" title={
                        mode === 'Ajouter' ? 'Ajouter le rappel' : 'Modifier le rappel'
                    }>{mode}</button>
                    {reminder && (
                        <button className="deleteButton" title={'Supprimer le rappel'}
                            onClick={() => {
                                delReminder(reminder.id);
                                onClose();
                            }}>
                            <Trash2 size={10}/> Supprimer le rappel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PopUp;
