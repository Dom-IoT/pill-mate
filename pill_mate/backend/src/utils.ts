import { NextFunction, Request, Response } from 'express';
import { HTTP_400_BAD_REQUEST } from './status';

const MAX_DELAY = 2147483647;  // ms ~= 24.8 days

export const asyncErrorHandler = (
    func: (request: Request, response: Response) => Promise<void>,
) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        await Promise.resolve(func(request, response)).catch(next);
    };
};

export const checkUnexpectedKeys = <T extends object>(
    body: object,
    allowedKeys: Array<keyof T>,
    response: Response,
): boolean => {
    const unexpectedKeys = Object.keys(body).filter(
        key => !allowedKeys.includes(key as keyof T),
    );

    if (unexpectedKeys.length > 0) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({
                message: `Unexpected key${unexpectedKeys.length > 1 ? 's' : ''}: ` +
                    unexpectedKeys.join(', '),
            });
        return false;
    }

    return true;
};

export const isTimeValid = (time: unknown): time is string => {
    return typeof time === 'string' && /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};

export const isDateValid = (dateStr: unknown): dateStr is string => {
    if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

    const date = new Date(dateStr);
    const [year, month, day] = dateStr.split('-').map(x => parseInt(x, 10));

    return date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day;
};

export const isHomeAssistantUserIdValid = (id: unknown): id is string  => {
    return typeof id === 'string' && /^[0-9a-f]{32}$/.test(id);
};

export const getNextDate = (time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, 0, 0);

    const nextDate =  new Date();
    if (nextDate > timeDate) nextDate.setDate(nextDate.getDate() + 1);

    return nextDate;
};

export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * An util class to handle setTimeout with delay bigger than the maximum allowed
 * by the Node.js `setTimeout`.
 *
 * Node.js's native `setTimeout` has a maximum delay of ~24.8 days (2^31-1 ms).
 * `BigTimeout` chains multiple `setTimeout` calls if the requested delay exceeds that limit.
 *
 * https://nodejs.org/api/timers.html#settimeoutcallback-delay-args
 */
export class BigTimeout {
    private timeout?: NodeJS.Timeout;

    /**
     * Internal constructor, use `BigTimeout.set()` to create an instance.
     *
     * @param callback - The function to call when the timer elapses.
     * @param delayMs - The number of milliseconds to wait before calling the callback.
     */
    private constructor(callback: () => void, delayMs: number) {
        this.setBigTimeout(callback, delayMs);
    }

    /**
     * Create an start and new `BigTimeout`.
     *
     * @param callback - The function to call when the timer elapses.
     * @param delayMs - The number of milliseconds to wait before calling the callback.
     * @retuns An instance of `BigTimeout`, which an be cleared if needed.
     */
    static set(callback: () => void, delayMs: number): BigTimeout {
        return new BigTimeout(callback, delayMs);
    }

    /**
     * Recursively call `setTimeout` until the remaining delay is within the safe
     * range.
     *
     * @param callback - The function to call when the timer elapses.
     * @param delayMs - The remaining number of milliseconds to wait before calling the `callback`.
     */
    private setBigTimeout(callback: () => void, delayMs: number) {
        if (delayMs <= MAX_DELAY) {
            this.timeout = setTimeout(callback, delayMs);
            return;
        }

        this.timeout = setTimeout(() => {
            this.setBigTimeout(callback, delayMs - MAX_DELAY);
        }, MAX_DELAY);
    }

    /**
     * Cancel the timeout.
     */
    clear() {
        clearTimeout(this.timeout);
    }
}
