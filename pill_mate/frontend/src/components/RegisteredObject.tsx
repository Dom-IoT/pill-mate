import { FC, useState } from 'react';
import { Medication, MedicationUnitLabel } from '../models/Medication/index';
import './RegisteredObject.css';
import PopUpStock from './PopUpStock';

interface Props {
    medication: Medication,
    color:'blue' | 'green' | 'red' | 'orange'
};

const RegisteredObject: FC<Props> = ({medication, color}) => {
    const [show, setShow] = useState(false);

    return (
        <div className={`RegisteredObject ${color}`}>
            <div>
                <p>{medication.name}{medication.indication ? `, (${medication.indication})` :''}</p>
                <p>Il reste {medication.quantity} {MedicationUnitLabel[medication.unit]}</p>
            </div>
            <div className="button" onClick={() => setShow(true)}>Modifier</div>
            {show && <PopUpStock onClose={() => setShow(false)}
                mode="Modifier"
                medication={medication}
            />}
        </div>
    );
};

export default RegisteredObject;
