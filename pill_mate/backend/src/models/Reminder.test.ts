import { Sequelize } from 'sequelize-typescript';

import { Medication } from './Medication';
import { Reminder } from './Reminder';
import { User, UserHelp } from './User';

new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    models: [Medication, Reminder, User, UserHelp],
});

describe('nextDateTime getter', () => {
    it('should return the date when the reminder must be triggered', () => {
        const reminder1 = Reminder.build({
            time: '12:00',
            frequency: 1,
            quantity: 1,
            nextDate: '2025-03-13',
        });
        expect(reminder1.nextDateTime.getTime()).toBe(new Date('2025-03-13T12:00:00').getTime());

        const reminder2 = Reminder.build({
            time: '18:00',
            frequency: 1,
            quantity: 1,
            nextDate: '2026-12-31',
        });
        expect(reminder2.nextDateTime.getTime()).toBe(new Date('2026-12-31T18:00:00').getTime());
    });
});
