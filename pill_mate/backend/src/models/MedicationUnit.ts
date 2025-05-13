import assert from 'assert';
/**
 * @openapi
 * components:
 *   schemas:
 *     MedicationUnit:
 *       type: integer
 *       description: >
 *          The unit of the quantity of medication.
 *           * `0` - Tablet.
 *           * `1` - Pill.
 *           * `2` - Ml, milliliter.
 *           * `3` - Drops.
 *           * `4` - Unit, no unit.
 *       enum: [0, 1, 2, 3, 4]
 *       example: 1
 */
export enum MedicationUnit {
    TABLET,
    PILL,
    ML,
    DROPS,
    UNIT,
}

export const isMedicationUnit = (value: unknown): value is MedicationUnit => {
    return typeof value === 'number' && value in MedicationUnit;
};

export const medicationUnitToString = (medicationUnit: MedicationUnit, plural: boolean) => {
    switch (medicationUnit) {
    case MedicationUnit.TABLET:
        return plural ? 'comprimés' : 'comprimé';
    case MedicationUnit.PILL:
        return plural ? 'pilules' : 'pilule';
    case MedicationUnit.ML:
        return plural ? 'millilitres' : 'millilitre';
    case MedicationUnit.DROPS:
        return 'gouttes';
    case MedicationUnit.UNIT:
        return plural ? 'unités' : 'unité';
    default:
        assert(false, 'unreachable');
    }
};
