import assert from 'assert';

import { createLogger } from '../logger';
import { Reminder } from '../models/Reminder';
import { BigTimeout, formatDate } from '../utils';

const logger = createLogger('backend');

const reminderTimeouts = new Map<number, BigTimeout>();

export class ReminderService {

    static async initAllTimeouts() {
        const reminders = await Reminder.findAll();
        reminders.forEach(reminder => {
            const nextDate = reminder.nextDateTime;
            if (nextDate.getTime() < Date.now()) {
                do {
                    nextDate.setDate(nextDate.getDate() + reminder.frequency);
                } while (nextDate.getTime() < Date.now());
                reminder.nextDate = formatDate(nextDate);
                reminder.save();  // The timeout will be set up by the hook.
            } else {
                ReminderService.setUpTimeout(reminder);
            }
        });
    };

    private static async trigger(reminder: Reminder) {
        reminderTimeouts.delete(reminder.id);

        logger.info(`Triggered reminder ${reminder.id} ` +
                    `for user ${reminder.userId} ` +
                    `target time ${reminder.nextDate} ${reminder.time}`);
        // TODO: make the reminder actually do something
        // https://github.com/Dom-IoT/pill-mate/issues/14

        const newNextDate = new Date(reminder.nextDate);
        newNextDate.setDate(newNextDate.getDate() + reminder.frequency);
        reminder.nextDate = formatDate(newNextDate);
        await reminder.save();
    }


    static setUpTimeout(reminder: Reminder) {
        reminderTimeouts.set(reminder.id, BigTimeout.set(
            () => ReminderService.trigger(reminder),
            reminder.nextDateTime.getTime() - Date.now()),
        );
        logger.debug(`Create reminder ${reminder.id} timeout`);
    }

    static updateTimeout(reminder: Reminder) {
        const timeout = reminderTimeouts.get(reminder.id);
        if (timeout !== undefined) {
            logger.debug(`Removed reminder ${reminder.id} timeout`);
            timeout.clear();
        }

        ReminderService.setUpTimeout(reminder);
    }

    static clearTimeout(reminder: Reminder) {
        logger.debug(`Removed reminder ${reminder.id} timeout`);
        const timeout = reminderTimeouts.get(reminder.id);
        assert(timeout !== undefined);
        timeout.clear();
    }
}
