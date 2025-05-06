import { FC } from 'react';
import './PrescriptionCard.css';

interface Props {
    prescription: {
        id: string;
        patient: string;
        date: string;
        medications: string[];
    };
    color: string;
}

const PrescriptionCard: FC<Props> = ({ prescription, color }) => {
    return (
        <div className={`PrescriptionCard ${color}`}>
            <h3>{prescription.patient}</h3>
            <p>Date : {prescription.date}</p>
            <ul>
                {prescription.medications.map((med, i) => (
                    <li key={i}>{med}</li>
                ))}
            </ul>
        </div>
    );
};

export default PrescriptionCard;
