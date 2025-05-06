import { FC, FormEvent, useState } from 'react';
import './PrescriptionPopUp.css';
import { CircleX } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const PrescriptionPopUp: FC<Props> = ({ onClose }) => {
    const [patient, setPatient] = useState('');
    const [date, setDate] = useState('');
    const [medications, setMedications] = useState('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (patient && date && medications) {
            onClose();
        }
    };

    return (
        <div className="Screen">
            <form className="PrescriptionPopUp PopUp" onSubmit={handleSubmit}>
                <h2>Ajouter une ordonnance</h2>
                <button type="button" title="Fermer" onClick={onClose} className="crossIcon">
                    <CircleX size={24} />
                </button>

                <div className="title">Nom de l'ordonnance</div>
                <input
                    type="text"
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    placeholder="Ex : Ordonnance du 12/04"
                    required
                />

                <div className="title">Nom médecin</div>
                <textarea
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="Dr HOUSE"
                    required
                />

                <div className="title">Date</div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <div className="title">Médicaments</div>
                <textarea
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="Listez vos médicaments"
                    required
                />

                <button type="submit" className="submit">Ajouter</button>
            </form>
        </div>
    );
};

export default PrescriptionPopUp;
