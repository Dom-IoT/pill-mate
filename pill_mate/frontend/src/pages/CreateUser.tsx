import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/useUser';

const CreateUser = () => {
    const { createUser } = useUser();
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!role) return;

        try {
            await createUser(role);
            navigate('/dashboard'); // Rediriger vers le Dashboard après la création
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div>
            <h2>Create Your User</h2>
            <form onSubmit={handleSubmit}>
                <label>
                Role:
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </label>
                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default CreateUser;
