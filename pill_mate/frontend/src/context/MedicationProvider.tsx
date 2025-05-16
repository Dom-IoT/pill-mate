import { useState, ReactNode, useEffect } from 'react';
import { Medication, CreateMedication, PatchMedication } from '../models/Medication/index.ts';
import {
    addMedicationAPI,
    deleteMedicationAPI,
    modifyMedicationAPI,
    getMedicationAPI,
} from '../services/medicationServices';
import { MedicationContext } from './MedicationContext';

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserInfo = async () => {
            const medicationsInfo = await getMedicationAPI();
            setMedications(medicationsInfo);
            setLoading(false);
        };
        loadUserInfo();
    }, []);

    const addMedication = async (newMedication: CreateMedication) => {
        const medication = await addMedicationAPI(newMedication);
        setMedications(prev => [...prev, medication]);
    };

    const modifyMedication = async ( id: number, modifiedNewMedication: PatchMedication) => {
        const newmedication = await modifyMedicationAPI(id, modifiedNewMedication);
        setMedications(prev => prev.map(medication => medication.id === id
            ? newmedication
            : medication,
        ));
    };

    const delMedication = async (id: number) => {
        await deleteMedicationAPI(id);
        setMedications(prev => prev.filter(medication => medication.id !== id));
    };

    return (
        <MedicationContext.Provider value={{
            loading,
            medications: medications,
            addMedication: addMedication,
            modifyMedication: modifyMedication,
            delMedication: delMedication,
        }}>
            {children}
        </MedicationContext.Provider>
    );
};
