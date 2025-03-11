import {
    AllowNull,
    Column,
    DataType,
    HasMany,
    Min,
    Model,
    NotEmpty,
    Table,
} from 'sequelize-typescript';
import { Reminder } from './Reminder';

export enum MedicationUnit {
    TABLET,
    CAPSULE,
    ML,
    DROPS,
    UNIT,
}

@Table({ timestamps: false })
export class Medication extends Model {

    @AllowNull(false)
    @NotEmpty
    @Column
    declare name: string;

    @NotEmpty
    @Column(DataType.STRING(500))
    declare indication: string;

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

    @HasMany(() => Reminder)
    declare reminders: Reminder[];
}
