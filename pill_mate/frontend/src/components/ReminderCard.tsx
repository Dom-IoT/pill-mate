import { FC, useState } from 'react';
import './ReminderCard.css';
import { Reminder, DateMonths } from '../models/Reminder/index.ts';
import { MedicationUnitLabel } from '../models/Medication/MedicationUnitLabel.ts';
import { useMedications } from '../context/useMedication.ts';
import PopUpCalendar from './PopUpCalendar.tsx';

interface Props {
    reminder: Reminder,
    color:'blue' | 'green' | 'red' | 'orange',
};

const ReminderCard: FC<Props> = ({reminder, color }) => {
    const [show, setShow] = useState(false);
    const { medications } = useMedications();

    return (
        <div className={`ReminderBar ${color}`}>
            <div>
                <p>{medications.find(
                    medication => medication.id === reminder.medicationId,
                )?.name
                    ?? 'Médicament inconnu'}
                </p>
                <p>Prendre {reminder.quantity} {MedicationUnitLabel[medications.find(
                    medication => medication.id === reminder.medicationId,
                )?.unit ?? 4]} tous les{
                    reminder.frequency === 1 ? '' : ' ' + reminder.frequency
                } jours à {
                    reminder.time
                }<br/>
                Prochaine prise le {
                    reminder.nextDate.substring(8)
                } {
                    DateMonths[reminder.nextDate.substring(5,7)]
                } {
                    reminder.nextDate.substring(0,4)
                }</p>
            </div>
            <div className="button" onClick={() => setShow(true)}>Modifier</div>
            {show && <PopUpCalendar onClose={
                () => setShow(false)} mode="Modifier" reminder={reminder}
            />}
        </div>
    );
};

export default ReminderCard;
