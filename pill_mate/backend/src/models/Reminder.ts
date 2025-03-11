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

@Table({ timestamps: false })
export class Reminder extends Model {

    @AllowNull(false)
    @Column(DataType.TIME)
    declare time: Date;

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
    declare nextDate: Date;

    @BelongsTo(() => Medication)
    declare medication: Medication;

    @ForeignKey(() => Medication)
    @AllowNull(false)
    @Column
    declare medicationId: number;
}
