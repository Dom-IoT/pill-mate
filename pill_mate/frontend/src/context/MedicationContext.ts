import { createContext } from 'react';
import { Medication, CreateMedication, PatchMedication } from '../models/Medication/index.ts';

interface MedicationContextType {
    loading: boolean;
    medications: Medication[];
    addMedication: (newMedication: CreateMedication) => void;
    modifyMedication: (id: number, oldmedication: PatchMedication) => void;
    delMedication: (id: number) => void;
}


export const MedicationContext = createContext<MedicationContextType | undefined>(undefined);
