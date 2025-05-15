import { MedicationUnit } from './MedicationUnit';

export interface CreateMedication {
    name: string;
    indication: string | null;
    quantity: number;
    unit: MedicationUnit;
    userId: number
}
