import { useContext } from 'react';
import ReminderContext from './ReminderContext.tsx';


export const useReminders = () => {
    const context = useContext(ReminderContext);
    if (!context) {
        throw new Error('useReminders must be used within a ReminderProvider');
    }
    return context;
};
