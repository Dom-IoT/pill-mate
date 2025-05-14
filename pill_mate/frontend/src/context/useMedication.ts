import { useContext } from 'react';
import { MedicationContext } from './MedicationContext.ts';


export const useMedications = () => {
    const context = useContext(MedicationContext);
    if (!context) {
        throw new Error('useMedications must be used within a MedicationProvider');
    }
    return context;
};
