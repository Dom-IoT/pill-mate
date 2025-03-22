import React, { useState, useEffect, ReactNode } from 'react';
import { getUserInfo, createUser as apiCreateUser } from '../services/userServices.tsx';
import { UserContext, UserContextType } from './UserContext.tsx';

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserContextType['user'] | undefined>(undefined);

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                setUser(userInfo);
            } catch (error) {
                console.error(error);
                setUser(null);
            }
        };
        loadUserInfo();
    }, []);

    const createUser = async (role: string) => {
        try {
            const newUser = await apiCreateUser(role);
            setUser(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
        }
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
