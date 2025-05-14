import { MedicationUnit } from './MedicationUnit';

export interface PatchMedication {
    name: string;
    indication: string | null;
    quantity: number;
    unit: MedicationUnit;
}
