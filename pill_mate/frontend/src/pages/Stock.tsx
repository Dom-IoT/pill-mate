import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './Stock.css';
import { useMedications } from '../context/useMedication.ts';
import RegisteredObject from '../components/RegisteredObject';
import AddButton from '../components/AddButton';
import PopUpStock from '../components/PopUpStock.tsx';

const Stock: FC = () => {
    const { medications } = useMedications();
    const [show, setShow] = useState(false);

    return (
        <div className="Stock">
            <h1 className="Title">Liste des médicament déjà enregistrés</h1>
            <div className="StockList">
                <div onClick={() => setShow(true)}>
                    <AddButton
                        title="Ajouter un rappel"
                        color="green"
                    />
                </div>
                {show &&
                    <PopUpStock onClose={() => setShow(false)} mode="Ajouter" medication={null}
                    />}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {medications.length > 0 ? (
                        medications.map((medication, index) => (
                            <RegisteredObject
                                key={ index }
                                medication={ medication }
                                color="green"
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
