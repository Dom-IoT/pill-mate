import { UserRole } from './UserRole.ts';

export interface User {
    id: number;
    homeAssistantUserId: string;
    userName: string;
    userDisplayName: string;
    role: UserRole;
}
