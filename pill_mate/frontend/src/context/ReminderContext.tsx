import { createContext, useState, ReactNode } from 'react';

interface Reminder {
    id: number;
    name: string;
    date: Date;
}

interface ReminderContextType {
    reminders: Reminder[];
    addReminder: (name: string, date: Date) => void;
}


const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const addReminder = (name: string, date: Date) => {
        setReminders(prev => [...prev, { id: Date.now(), name, date }]);
    };

    return (
        <ReminderContext.Provider value={{ reminders, addReminder }}>
            {children}
        </ReminderContext.Provider>
    );
};

export default ReminderContext;
