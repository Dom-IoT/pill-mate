import React, { useState, useEffect, ReactNode } from 'react';
import { getUserInfo, createUser as apiCreateUser } from '../services/userServices.ts';
import { User, UserRole } from '../models/User/index.ts';
import { UserContext } from './UserContext.ts';

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                setUser(userInfo);
            } catch {
                setUser(null);
            }
        };
        loadUserInfo();
    }, []);

    const createUser = async (role: UserRole) => {
        const newUser = await apiCreateUser(role);
        setUser(newUser);
    };

    if (user === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ user, createUser }}>
            {children}
        </UserContext.Provider>
    );
};
