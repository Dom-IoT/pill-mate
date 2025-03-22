// frontend/src/services/userService.ts
const API_URL = 'http://localhost:3000/api/user'; // Remplace par l'URL de ton backend

// Récupérer les informations de l'utilisateur connecté
export const getUserInfo = async () => {
    const response = await fetch(`${API_URL}/me`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de l\'utilisateur');
    }
    return response.json();
};

// Créer un utilisateur
export const createUser = async (role: string) => {
    const response = await fetch(API_URL, {
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
