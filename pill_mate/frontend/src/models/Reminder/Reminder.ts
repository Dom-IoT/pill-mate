export interface Reminder {
    id: number;
    time: string;
    frequency: number;
    quantity: number;
    nextDate: string;
    medicationId: number;
    userId: number
}
