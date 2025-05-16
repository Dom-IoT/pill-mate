import { Reminder, CreateReminder, PatchReminder } from '../models/Reminder/index.ts';
import { apiService } from './apiService';


export const getReminderAPI = async (): Promise<Reminder[]> => {
    return await apiService<Reminder[]>({ method: 'GET', route: '/reminder' });
};

export const addReminderAPI = async (newReminder: CreateReminder): Promise<Reminder> => {
    return await apiService<Reminder>({ method: 'POST', body: newReminder, route: '/reminder/' });
};

export const deleteReminderAPI = async (id: number): Promise<void> => {
    apiService<void>({ method: 'DELETE', route: `/reminder/${id}` });
};

export const modifyReminderAPI = async (
    id: number,
    modifiedNewReminder: PatchReminder,
): Promise<Reminder> => {
    return await apiService<Reminder>({
        method: 'PATCH',
        body: modifiedNewReminder,
        route: `/reminder/${id}`,
    });
};
