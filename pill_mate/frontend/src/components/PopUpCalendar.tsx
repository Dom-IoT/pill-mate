import { FC, FormEvent, useState } from 'react';
import './PopUpCalendar.css';
import { CircleX, Trash2 } from 'lucide-react';
import { Reminder } from '../models/Reminder/index.ts';
import { useReminders } from '../context/useReminder.ts';
import { useMedications } from '../context/useMedication.ts';
import { useUser } from '../context/useUser.ts';

interface Props {
    onClose: () => void;
    mode: 'Ajouter' | 'Modifier';
    reminder: Reminder | null;
}

const PopUpCalendar: FC<Props> = ({ onClose, mode, reminder }) => {
    const { addReminder, modifyReminder, delReminder } = useReminders();
    const { medications } = useMedications();

    const [medicationId, setMedicationId] = useState(reminder === null ? '': reminder.medicationId);
    const [time, setTime] = useState(reminder === null ? '' : reminder.time);
    const [frequency, setFrequency] = useState(reminder === null ? 1 : reminder.frequency);
    const [quantity, setQuantity] = useState(reminder === null ? 1 : reminder.quantity);
    const [nextDate, setNextDate] = useState(reminder === null ? '' : reminder.nextDate);
    const user = useUser();
    if (!user || !user.user) {
        throw new Error('Aucun utilisateur connecté');
    }

    const userId = user.user.id;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (time && frequency && quantity && medicationId !== '') {
            if (mode === 'Modifier' && reminder !== null) {
                modifyReminder(reminder.id, { time, frequency, nextDate, quantity,
                    medicationId: medicationId as number });
                onClose();
            } else {
                addReminder({ time, frequency, quantity, medicationId: medicationId as number,
                    userId });
                onClose();
            }
        }
    };

    return (
        <div className="Screen">
            <form className="PopUpCalendar" onSubmit={handleSubmit}>
                <h2>{mode === 'Ajouter' ? 'Créer un rappel' : 'Modifier le rappel'}</h2>
                <button
                    type="button"
                    title="Fermer la PopUp"
                    onClick={onClose} className="crossIcon">
                    <CircleX size={24}/>
                </button>

                <div className="title">Médicament</div>
                <select
                    required={true}
                    value={medicationId}
                    onChange={(e) => setMedicationId(parseInt(e.target.value))}
                >
                    {medications.map((med) => (
                        <option key={med.id} value={med.id}>
                            {med.name}
                        </option>
                    ))}
                </select>
                <p className="description">Nom du médicament à prendre</p>

                {mode === 'Modifier' && (
                    <>
                        <div className="title">Prochaine date de prise</div>
                        <input
                            type="text"
                            required={false}
                            value={nextDate}
                            placeholder="2025-03-13"
                            pattern="^\d{4}-\d{2}-\d{2}$"
                            onChange={(e) => setNextDate(e.target.value)}
                        />
                        <p className="description">
                            Prochaine date où le rappel doit sonner
                        </p>
                    </>
                )}
                <div className="title">Fréquence du rappel</div>
                <input
                    type="number"
                    required= {true}
                    value={frequency}
                    min={1}
                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                />
                <p className="description">(1 pour tous les jours, 2 pour tous les 2 jours, ...)</p>
                <div className="title">Heure de la prise</div>
                <input
                    type="text"
                    required= {true}
                    value={time}
                    placeholder="12:00"
                    pattern='^([01]\d|2[0-3]):[0-5]\d$'
                    onChange={(e) => setTime(e.target.value)}
                />
                <p className="description">Format de l'heure à respecter : hh:mm</p>
                <div className="title">Quantité à prendre</div>
                <input
                    type="number"
                    required= {true}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <p className="description">Quantité à prendre</p>
                <div className="Settings">
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

export default PopUpCalendar;
