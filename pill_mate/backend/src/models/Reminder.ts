import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Min,
    Model,
    Table,
} from 'sequelize-typescript';
import { Medication } from './Medication';
import { User } from './User';

/**
 * @openapi
 * components:
 *   schemas:
 *     Reminder:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier of the reminder.
 *           example: 1
 *         time:
 *           type: string
 *           description: Reminder time.
 *           example: 12:00
 *         frequency:
 *           type: integer
 *           description: The number of days between each reminder.
 *           example: 1
 *         quantity:
 *           type: number
 *           description: The quantity of medication the user must take.
 *           example: 1
 *         nextDate:
 *           type: string
 *           description: The date when the reminder will be triggered.
 *           example: 2025-03-13
 *         medicationId:
 *           type: integer
 *           description: The id of the medication to take.
 *           example: 1
 *         userId:
 *           type: integer
 *           description: The id of the user to whom the reminder belongs.
 *           example: 1
 */

@Table({ timestamps: false })
export class Reminder extends Model {

    @AllowNull(false)
    @Column(DataType.TIME)
    declare time: string;

    @AllowNull(false)
    @Min(1)
    @Column
    declare frequency: number;

    @AllowNull(false)
    @Min(0.01)
    @Column({
        type: DataType.DECIMAL(6, 2),
        allowNull: false,
    })
    declare quantity: number;

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    declare nextDate: string;

    @BelongsTo(() => Medication)
    declare medication: Medication;

    @ForeignKey(() => Medication)
    @AllowNull(false)
    @Column
    declare medicationId: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}
