import { User, UserRole } from '../models/User/index.ts';
import { apiService } from './apiService';

export const getUserInfo = async (): Promise<User | null> => {
    return await apiService<User>({ route: '/user/me' });
};

export const createUser = async (role: UserRole): Promise<User> => {
    return await apiService<User>({ method: 'POST', body: {role}, route: '/user/' });
};
