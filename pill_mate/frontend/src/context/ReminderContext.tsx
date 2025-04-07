import { createContext, useState, ReactNode } from 'react';

export interface Reminder {
    id: number;
    name: string;
    heurePrise: Date;
    frequence: number;
    date: Date;
}

interface ReminderContextType {
    reminders: Reminder[];
    addReminder: (name: string, heurePrise: Date, frequence: number) => void;
    modifyReminder: (
        reminder: Reminder,
        newName: string,
        newHeurePrise: Date,
        newFrequence: number) => void;
    delReminder: (id: number) => void;
}


const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const addReminder = (name: string, heurePrise: Date, frequence: number) => {

        setReminders(prev => [{
            id: Date.now(),
            name: name,
            heurePrise: heurePrise,
            frequence: frequence,
            date: new Date(),
        }, ...prev]);
    };

    const modifyReminder = (
        { id }: Reminder,
        newName: string,
        newHeurePrise: Date,
        newFrequence: number) => {
        setReminders(prev => prev.map(prevReminder =>
            prevReminder.id === id
                ? {...prevReminder,
                    name: newName,
                    heurePrise: newHeurePrise,
                    frequence: newFrequence}
                : prevReminder,
        ));
    };

    const delReminder = (id: number) => {
        setReminders(prev => prev.filter(reminder => reminder.id !== id));
    };

    return (
        <ReminderContext.Provider value={{ reminders, addReminder, modifyReminder, delReminder }}>
            {children}
        </ReminderContext.Provider>
    );
};

export default ReminderContext;
