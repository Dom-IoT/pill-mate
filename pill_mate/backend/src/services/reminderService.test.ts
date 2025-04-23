import { Reminder } from '../models/Reminder';
import { BigTimeout } from '../utils';
import { ReminderService } from './reminderService';

jest.mock('../models/Reminder', () => {
    return {
        Reminder: {
            findAll: jest.fn(),
        },
    };
});

jest.mock('../utils', () => {
    return {
        BigTimeout: {
            set: jest.fn(),
        },
        formatDate: jest.requireActual('../utils').formatDate,
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

jest.useFakeTimers();

describe('initAllTimeouts method', () => {
    it('should not set any timeout if there are no reminders', async () => {
        (Reminder.findAll as jest.Mock).mockResolvedValue([]);
        await ReminderService.initAllTimeouts();
        expect(BigTimeout.set).not.toHaveBeenCalled();
    });

    it('should init all timeouts', async () => {
        (Reminder.findAll as jest.Mock).mockResolvedValue([
            { nextDateTime: new Date('2025-03-13T12:00:00Z') },
            { nextDateTime: new Date('2025-03-13T18:00:00Z') },
            { nextDateTime: new Date('2025-03-14T08:00:00Z') },
        ]);
        jest.setSystemTime(new Date('2025-03-13T10:00:00Z'));
        await ReminderService.initAllTimeouts();
        expect(BigTimeout.set).toHaveBeenCalledTimes(3);
    });

    it('should update the next date of the reminders if their date is passed', async () => {
        const reminders = [
            {
                frequency: 1,
                nextDate: '2025-03-13',
                nextDateTime: new Date('2025-03-13T12:00:00Z'),
                save: jest.fn(),
            },
            {
                frequency: 2,
                nextDate: '2025-03-13',
                nextDateTime: new Date('2025-03-13T18:00:00Z'),
                save: jest.fn(),
            },
            {
                frequency: 2,
                nextDate: '2025-03-14',
                nextDateTime: new Date('2025-03-14T08:00:00Z'),
                save: jest.fn(),
            },
        ];
        (Reminder.findAll as jest.Mock).mockResolvedValue(reminders);
        jest.setSystemTime(new Date('2025-03-15T10:00:00Z'));
        await ReminderService.initAllTimeouts();
        reminders.forEach(reminder => {
            expect(reminder.save).toHaveBeenCalledTimes(1);
        });
        expect(reminders[0].nextDate).toBe('2025-03-15');
        expect(reminders[1].nextDate).toBe('2025-03-15');
        expect(reminders[2].nextDate).toBe('2025-03-16');
    });
});

describe('setUpTimeout method', () => {
    it('should create a timeout for the reminder', () => {
        jest.setSystemTime(new Date('2025-03-15T10:00:00Z'));
        ReminderService.setUpTimeout({
            id: 1,
            nextDateTime: new Date('2025-03-15T14:00:00Z'),
        } as Reminder);
        expect(BigTimeout.set).toHaveBeenCalledTimes(1);
        expect(BigTimeout.set).toHaveBeenCalledWith(expect.any(Function), 14400000);
    });

    it('should trigger the reminder and change is next date', async () => {
        const reminder = {
            id: 1,
            nextDate: '2025-03-15',
            frequency: 1,
            nextDateTime: new Date('2025-03-15T14:00:00Z'),
            save: jest.fn(),
        };
        ReminderService.setUpTimeout(reminder as unknown as Reminder);
        expect(BigTimeout.set).toHaveBeenCalledTimes(1);
        expect(BigTimeout.set).toHaveBeenCalledWith(expect.any(Function), 14400000);
        // Call the trigger function
        await (BigTimeout.set as jest.Mock).mock.calls[0][0]();
        expect(reminder.save).toHaveBeenCalledTimes(1);
        expect(reminder.nextDate).toBe('2025-03-16');
    });
});

describe('updateTimeout method', () => {
    it('should create a new timeout for the reminder', () => {
        jest.setSystemTime(new Date('2025-03-15T10:00:00Z'));
        ReminderService.updateTimeout({
            id: 1,
            nextDateTime: new Date('2025-03-15T14:00:00Z'),
        } as Reminder);
        expect(BigTimeout.set).toHaveBeenCalledTimes(1);
        expect(BigTimeout.set).toHaveBeenCalledWith(expect.any(Function), 14400000);
    });

    it('should create a new timeout for the reminder and remove the previous one', () => {
        jest.setSystemTime(new Date('2025-03-15T10:00:00Z'));
        const clear = jest.fn();
        (BigTimeout.set as jest.Mock).mockReturnValue({ clear });
        ReminderService.setUpTimeout({
            id: 1,
            nextDateTime: new Date('2025-03-15T14:00:00Z'),
        } as Reminder);
        expect(BigTimeout.set).toHaveBeenCalledTimes(1);
        expect(BigTimeout.set).toHaveBeenCalledWith(expect.any(Function), 14400000);
        ReminderService.updateTimeout({
            id: 1,
            nextDateTime: new Date('2025-03-15T18:00:00Z'),
        } as Reminder);
        expect(clear).toHaveBeenCalledTimes(1);
        expect(BigTimeout.set).toHaveBeenCalledTimes(2);
        expect(BigTimeout.set).toHaveBeenCalledWith(expect.any(Function), 28800000);
    });
});

describe('clearTimeout method', () => {
    it('should remove the timeout of a reminder', () => {
        jest.setSystemTime(new Date('2025-03-15T10:00:00Z'));
        const clear = jest.fn();
        (BigTimeout.set as jest.Mock).mockReturnValue({ clear });
        ReminderService.setUpTimeout({
            id: 1,
            nextDateTime: new Date('2025-03-15T14:00:00Z'),
        } as Reminder);
        expect(BigTimeout.set).toHaveBeenCalledTimes(1);
        expect(BigTimeout.set).toHaveBeenCalledWith(expect.any(Function), 14400000);
        ReminderService.clearTimeout({ id: 1 } as Reminder);
        expect(clear).toHaveBeenCalledTimes(1);
    });
});
