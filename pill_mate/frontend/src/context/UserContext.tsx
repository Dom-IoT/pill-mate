import { createContext } from 'react';
import { UserRole } from '../models/UserRole';

interface User {
  homeAssistantUserId: string;
  userName: string;
  userDisplayName: string;
  role: UserRole;
}

export interface UserContextType {
  user: User | null;
  createUser: (role: UserRole) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
