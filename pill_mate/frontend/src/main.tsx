import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProvider } from './context/UserProvider.tsx';
import { ReminderProvider } from './context/ReminderProvider.tsx';
import { MedicationProvider } from './context/MedicationProvider.tsx';

const rootElement = document.getElementById('root');

createRoot(rootElement!).render(
    <StrictMode>
        <UserProvider>
            <ReminderProvider>
                <MedicationProvider>
                    <App />
                </MedicationProvider>
            </ReminderProvider>
        </UserProvider>
    </StrictMode>,
);
