import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Min,
    Model,
    NotEmpty,
    Table,
} from 'sequelize-typescript';
import { Reminder } from './Reminder';
import { User } from './User';

/**
 * @openapi
 * components:
 *   schemas:
 *     MedicationUnit:
 *       type: integer
 *       description: >
 *          The unit of the quantity of medication.
 *           * `0` - Tablet.
 *           * `1` - Capsule.
 *           * `2` - Ml, milliliter.
 *           * `3` - Drops.
 *           * `4` - Unit, no unit.
 *       enum: [0, 1, 2, 3, 4]
 *       example: 1
 */
export enum MedicationUnit {
    TABLET,
    CAPSULE,
    ML,
    DROPS,
    UNIT,
}

export const isMedicationUnit = (value: unknown): value is MedicationUnit => {
    return typeof value === 'number' && value in MedicationUnit;
};

/**
 * @openapi
 * components:
 *   schemas:
 *     Medication:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the medication.
 *           example: Paracetamol
 *         indication:
 *           type: string
 *           description: An indication that help identify the medication.
 *           example: The red pills.
 *         quantity:
 *           type: number
 *           description: The quantity of medication remaining.
 *           example: 10
 *         unit:
 *           $ref: '#/components/schemas/MedicationUnit'
 *         userId:
 *           type: integer
 *           description: The id of the user to whom the medication belongs.
 *           example: 1
 */

@Table({ timestamps: false })
export class Medication extends Model {

    @AllowNull(false)
    @NotEmpty
    @Column
    declare name: string;

    @NotEmpty
    @Column(DataType.STRING(500))
    declare indication: string | null;

    @AllowNull(false)
    @Min(0.01)
    @Column({
        type: DataType.DECIMAL(6, 2),
        allowNull: false,
    })
    declare quantity: number;

    @AllowNull(false)
    @Column
    declare unit: MedicationUnit;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;

    @HasMany(() => Reminder)
    declare reminders: Reminder[];
}
