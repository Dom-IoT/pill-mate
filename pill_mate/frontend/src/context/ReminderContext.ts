import { createContext } from 'react';
import { Reminder, CreateReminder, PatchReminder } from '../models/Reminder/index.ts';

interface ReminderContextType {
    loading: boolean;
    reminders: Reminder[];
    addReminder: (newReminder: CreateReminder) => void;
    modifyReminder: (id: number, oldreminder: PatchReminder) => void;
    delReminder: (id: number) => void;
}


export const ReminderContext = createContext<ReminderContextType | undefined>(undefined);
