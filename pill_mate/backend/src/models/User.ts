import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
} from 'sequelize';
import {
    AllowNull,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Length,
    Model,
    Table,
    Unique,
} from 'sequelize-typescript';

import { Reminder } from './Reminder';
import { Medication } from './Medication';
import { UserRole } from './UserRole';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserInformations:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier of the user.
 *           example: 1
 *         homeAssistantUserId:
 *           type: string
 *           description: Unique identifier of the user in Home Assistant.
 *           example: c355d2aaeee44e4e84ff8394fa4794a9
 *         userName:
 *           type: string
 *           description: The username of the user in the system.
 *           example: johndoe
 *         userDisplayName:
 *           type: string
 *           description: The display name of the user.
 *           example: John Doe
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         mobileAppDevice:
 *           type: string
 *           nullable: true
 *           description: The devices where notifications will be send.
 *           example: Redmi Note 8T
 */

@Table({ timestamps: false })
export class User extends Model {

    @AllowNull(false)
    @Unique
    @Length({ min: 32, max: 32 })
    @Column(DataType.STRING(32))
    declare homeAssistantUserId: string;

    @AllowNull(false)
    @Column
    declare role: UserRole;

    @Default(null)
    @Column(DataType.STRING(255))
    declare mobileAppDevice: string | null;

    @BelongsToMany(() => User, () => UserHelp)
    declare helpedUsers: User[];

    declare getHelpedUsers: BelongsToManyGetAssociationsMixin<User>;
    declare setHelpedUsers: BelongsToManySetAssociationsMixin<User, number>;
    declare addHelpedUser: BelongsToManyAddAssociationMixin<User, number>;
    declare addHelpedUsers: BelongsToManyAddAssociationsMixin<User, number>;
    declare removeHelpedUser: BelongsToManyRemoveAssociationMixin<User, number>;
    declare removeHelpedUsers: BelongsToManyRemoveAssociationsMixin<User, number>;
    declare hasHelpedUser: BelongsToManyHasAssociationMixin<User, number>;
    declare hasHelpedUsers: BelongsToManyHasAssociationsMixin<User, number>;
    declare countHelpedUsers: BelongsToManyCountAssociationsMixin;
    declare createHelpedUser: BelongsToManyCreateAssociationMixin<User>;

    @BelongsToMany(() => User, () => UserHelp)
    declare helpers: User[];

    @HasMany(() => Reminder)
    declare reminders: Reminder[];

    declare getReminders: HasManyGetAssociationsMixin<Reminder>;
    declare setReminders: HasManySetAssociationsMixin<Reminder, number>;
    declare addReminder: HasManyAddAssociationMixin<Reminder, number>;
    declare addReminders: HasManyAddAssociationsMixin<Reminder, number>;
    declare removeReminder: HasManyRemoveAssociationMixin<Reminder, number>;
    declare removeReminders: HasManyRemoveAssociationsMixin<Reminder, number>;
    declare hasReminder: HasManyHasAssociationMixin<Reminder, number>;
    declare hasReminders: HasManyHasAssociationsMixin<Reminder, number>;
    declare countReminders: HasManyCountAssociationsMixin;
    declare createReminder: HasManyCreateAssociationMixin<Reminder>;

    @HasMany(() => Medication)
    declare medications: Medication[];

    declare getMedications: HasManyGetAssociationsMixin<Medication>;
    declare setMedications: HasManySetAssociationsMixin<Medication, number>;
    declare addMedication: HasManyAddAssociationMixin<Medication, number>;
    declare addMedications: HasManyAddAssociationsMixin<Medication, number>;
    declare removeMedication: HasManyRemoveAssociationMixin<Medication, number>;
    declare removeMedications: HasManyRemoveAssociationsMixin<Medication, number>;
    declare hasMedication: HasManyHasAssociationMixin<Medication, number>;
    declare hasMedications: HasManyHasAssociationsMixin<Medication, number>;
    declare countMedications: HasManyCountAssociationsMixin;
    declare createMedication: HasManyCreateAssociationMixin<Medication>;
}

@Table({ timestamps: false })
export class UserHelp extends Model {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    declare helperId: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    declare helpedUserId: number;
}
