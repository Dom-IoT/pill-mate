import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import './Prescription.css';
import { Scan } from 'lucide-react';
// import TitleBar from '../components/TitleBar.tsx';
import PrescriptionPopUp from '../components/PrescriptionPopUp.tsx';
import PrescriptionCard from '../components/PrescriptionCard.tsx';

const Prescription: FC = () => {
    const [show, setShow] = useState(false);

    const prescriptions = [
        {
            id: '1',
            patient: 'Ordonnance 1',
            date: '6 Juin 2024',
            medications: ['Metformine 500mg 2X/Jour => Efficace sur la baisse de glycémie', 'Amarel 2mg => Permet la lutte contre le taux de sucre dans le sang'],
        },
        {
            id: '2',
            patient: 'Ordonnance de Suivi',
            date: '20 Juin 2024',
            medications: ['Empagliflozine 10mg => Protège les reins'],
        },
    ];

    return (
        <div className="Prescription">
            <h1 className="Title">Historique des ordonnances</h1>
            <div className="prescriptionList">
            <div className="addPrescriptionContainer">
                <button onClick={() => setShow(true)} className="addPrescriptionButton">
                    Ajouter une ordonnance
                </button>
            <div className="scanIconBox">
                <Scan size={24} />
            </div>
        </div>




                {show && <PrescriptionPopUp onClose={() => setShow(false)} />}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {prescriptions.length > 0 ? (
                        prescriptions.map((prescription) => (
                            <PrescriptionCard
                                key={prescription.id}
                                prescription={prescription}
                                color="purple"
                            />
                        ))
                    ) : (
                        <p>Aucune ordonnance trouvée.</p>
                    )}
                </div>
            </div>
            <nav>
                <Link to="/" className="navButton">Retour</Link>
            </nav>

        </div>
    );
};

export default Prescription;
