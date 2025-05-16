import { useState, ReactNode, useEffect } from 'react';
import { Reminder, CreateReminder, PatchReminder } from '../models/Reminder/index.ts';
import {
    addReminderAPI,
    deleteReminderAPI,
    modifyReminderAPI,
    getReminderAPI,
} from '../services/reminderServices';
import { ReminderContext } from './ReminderContext';

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserInfo = async () => {
            const remindersInfo = await getReminderAPI();
            setReminders(remindersInfo);
            setLoading(false);
        };
        loadUserInfo();
    }, []);

    const addReminder = async (newReminder: CreateReminder) => {
        const reminder = await addReminderAPI(newReminder);
        setReminders(prev => [reminder, ...prev]);
    };

    const modifyReminder = async ( id: number, modifiedNewReminder: PatchReminder) => {
        const newreminder = await modifyReminderAPI(id, modifiedNewReminder);
        setReminders(prev => prev.map(reminder => reminder.id === id ? newreminder : reminder));
    };

    const delReminder = async (id: number) => {
        await deleteReminderAPI(id);
        setReminders(prev => prev.filter(reminder => reminder.id !== id));
    };

    return (
        <ReminderContext.Provider value={{
            loading,
            reminders,
            addReminder,
            modifyReminder,
            delReminder,
        }}>
            {children}
        </ReminderContext.Provider>
    );
};
