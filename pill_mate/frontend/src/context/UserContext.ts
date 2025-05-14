import { createContext } from 'react';
import { User, UserRole } from '../models/User/index.ts';

export interface UserContextType {
  user: User | null;
  createUser: (role: UserRole) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
