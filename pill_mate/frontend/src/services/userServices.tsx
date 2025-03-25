import { UserRole } from '../models/UserRole';

const API_URL = 'api';

export const getUserInfo = async () => {
    const response = await fetch(`${API_URL}/user/me`);
    if (response.ok){
        return response.json();
    }

    if (response.status === 404) {
        return null;
    }
    throw new Error('Erreur lors de la récupération des informations de l\'utilisateur');
};

export const createUser = async (role: UserRole) => {
    const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
    }

    return response.json();
};
