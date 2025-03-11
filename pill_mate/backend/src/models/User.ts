import {
    AllowNull,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Length,
    Model,
    Table,
    Unique,
} from 'sequelize-typescript';
import { Reminder } from './Reminder';


/**
 * @openapi
 * components:
 *   schemas:
 *     UserRole:
 *       type: integer
 *       description: >
 *          The role of the user.
 *           * `0` - Helped, the user will be helped by the application.
 *           * `1` - Helper, the user will help an other user.
 *       enum: [0, 1]
 *       example: 1
 */
export enum UserRole {
    HELPED,
    HELPER,
}

export const isUserRole = (value: unknown): value is UserRole => {
    return typeof value === 'number' && value in UserRole;
};


/**
 * @openapi
 * components:
 *   schemas:
 *     UserInformations:
 *       type: object
 *       properties:
 *         homeAssistantUserId:
 *           type: string
 *           description: Unique identifier of the user in Home Assistant.
 *           example: c355d2aaeee44e4e84ff8394fa4794a9
 *         userName:
 *           type: string
 *           description: TThe username of the user in the system.
 *           example: johndoe
 *         userDisplayName:
 *           type: string
 *           description: The display name of the user.
 *           example: John Doe
 *         role:
 *           $ref: '#/components/schemas/UserRole'
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

    @BelongsToMany(() => User, () => UserHelp)
    declare helpedUsers: User[];

    @BelongsToMany(() => User, () => UserHelp)
    declare helpers: User[];

    @BelongsToMany(() => Reminder, () => UserReminder)
    declare reminders: Reminder[];
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

@Table({ timestamps: false })
export class UserReminder extends Model {

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    declare userId: number;

    @ForeignKey(() => Reminder)
    @AllowNull(false)
    @Column
    declare reminderId: number;
}
