import { createContext } from 'react';

interface User {
  homeAssistantUserId: string;
  userName: string;
  userDisplayName: string;
  role: string;
}

export interface UserContextType {
  user: User | null;
  createUser: (role: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
