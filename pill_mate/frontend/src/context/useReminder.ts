import { useContext } from 'react';
import { ReminderContext } from './ReminderContext.ts';


export const useReminders = () => {
    const context = useContext(ReminderContext);
    if (!context) {
        throw new Error('useReminders must be used within a ReminderProvider');
    }
    return context;
};
