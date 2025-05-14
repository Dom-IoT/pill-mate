import { Medication, CreateMedication, PatchMedication } from '../models/Medication/index.ts';
import { apiService } from './apiService.ts';


export const getMedicationAPI = async (): Promise<Medication[]> => {
    return await apiService<Medication[]>({ method: 'GET', route: '/medication' });
};

export const addMedicationAPI = async (newMedication: CreateMedication): Promise<Medication> => {
    return await apiService<Medication>({
        method: 'POST',
        body: newMedication,
        route: '/medication',
    });
};

export const modifyMedicationAPI = async (
    id: number,
    oldmedication: PatchMedication,
): Promise<Medication> => {
    return await apiService<Medication>({
        method: 'PATCH',
        body: oldmedication,
        route: `/medication/${id}`,
    });
};

export const deleteMedicationAPI = async (id: number): Promise<void> => {
    apiService<void>({ method: 'DELETE', route: `/medication/${id}` });
};

