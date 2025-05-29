import { FC, FormEvent, useState } from 'react';
import './PopUpStock.css';
import { CircleX, Trash2 } from 'lucide-react';
import { Medication, MedicationUnit, MedicationUnitLabel } from '../models/Medication/index.ts';
import { useMedications } from '../context/useMedication.ts';
import { useUser } from '../context/useUser.ts';

interface Props {
    onClose: () => void;
    mode: 'Ajouter' | 'Modifier';
    medication: Medication | null;
}

const PopUpStock: FC<Props> = ({ onClose, mode, medication: medication }) => {
    const { addMedication, modifyMedication, delMedication } = useMedications();

    const [name, setName] = useState(medication === null ? '' : medication.name);
    const [indication, setIndication] = useState(medication === null ? null: medication.indication);
    const [quantity, setQuantity] = useState(medication === null ? 1 : medication.quantity);
    const [unit, setUnit] = useState(medication === null ? 4 : medication.unit);
    const user = useUser();
    if (!user || !user.user) {
        throw new Error('Aucun utilisateur connecté');
    }

    const userId = user.user.id;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (name && quantity) {
            if (mode === 'Modifier' && medication !== null) {
                modifyMedication(medication.id, { name, indication, quantity, unit});
                onClose();
            } else {
                addMedication({ name, indication, quantity, unit, userId });
                onClose();
            }
        }
    };

    return (
        <div className="Screen">
            <form className="PopUpStock" onSubmit={handleSubmit}>
                <h2>{mode === 'Ajouter' ? 'Créer un médicament' : 'Modifier le médicament'}</h2>
                <button
                    type="button"
                    title="Fermer la PopUp"
                    onClick={onClose} className="crossIcon">
                    <CircleX size={24}/>
                </button>

                <div className="title">Nom du médicament</div>
                <input
                    type="text"
                    required= {true}
                    value={name}
                    placeholder="médicament"
                    min={1}
                    onChange={(e) => setName(e.target.value)}
                />
                <p className="description">exemple : paracétamole, doliprane, ...</p>

                <div className="title">Indication du médicament</div>
                <input
                    type="text"
                    value={indication ?? ''}
                    placeholder="indication"
                    onChange={(e) => setIndication(e.target.value === '' ? null : e.target.value)}
                />
                <p className="description">
                Nom mnémotechnique du médicament
                (exemple : les pilules rouges)</p>

                <div className="title">Quantité restante dans les stocks</div>
                <div className="input-select">
                    <input
                        type="number"
                        min={0}
                        required= {true}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                    <select required= {true} onChange={(e) => setUnit(parseInt(e.target.value))}>
                        <option value={MedicationUnit.UNIT}>{
                            MedicationUnitLabel[MedicationUnit.UNIT]
                        }</option>
                        <option value={MedicationUnit.TABLET}>{
                            MedicationUnitLabel[MedicationUnit.TABLET]
                        }</option>
                        <option value={MedicationUnit.PILL}>{
                            MedicationUnitLabel[MedicationUnit.PILL]
                        }</option>
                        <option value={MedicationUnit.ML}>{
                            MedicationUnitLabel[MedicationUnit.ML]
                        }</option>
                        <option value={MedicationUnit.DROPS}>{
                            MedicationUnitLabel[MedicationUnit.DROPS]
                        }</option>
                    </select>
                </div>
                <p className="description">
                Quantité du médicament en stock
                </p>

                <div className="Settings">
                    <button type="submit" title={
                        mode === 'Ajouter' ? 'Ajouter le médicament' : 'Modifier le médicament'
                    }>{mode}</button>
                    {medication && (
                        <button className="deleteButton" title={'Supprimer le médicament'}
                            onClick={() => {
                                delMedication(medication.id);
                                onClose();
                            }}>
                            <Trash2 size={10}/> Supprimer le médicament
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PopUpStock;
