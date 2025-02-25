import { Column, Model, Table } from 'sequelize-typescript';

export enum UserRole {
    HELPED,
    HELPER,
}

export const isUserRole = (value: unknown): value is UserRole => {
    return typeof value === 'number' && value in UserRole;
};

@Table
export class User extends Model {

    @Column({
        allowNull: false,
        unique: true,
    })
    declare homeAssistantUserId: string;

    @Column({
        allowNull: false,
    })
    declare role: UserRole;
}
