import { MedicationUnit } from './MedicationUnit';

export interface Medication {
    id: number;
    name: string;
    indication: string | null;
    quantity: number;
    unit: MedicationUnit;
    userId: number
}
