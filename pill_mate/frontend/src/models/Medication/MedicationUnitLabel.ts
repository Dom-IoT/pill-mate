import { MedicationUnit } from './MedicationUnit';

export const MedicationUnitLabel: Record<MedicationUnit, string> = {
    [MedicationUnit.TABLET]: 'comprimé(s)',
    [MedicationUnit.PILL]: 'pilule(s)',
    [MedicationUnit.ML]: 'ml',
    [MedicationUnit.DROPS]: 'goutte(s)',
    [MedicationUnit.UNIT]: 'unité(s)',
};
