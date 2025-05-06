import { Request, Response } from 'express';

import {
    asyncErrorHandler,
    BigTimeout,
    checkUnexpectedKeys,
    formatDate,
    getNextDate,
    isDateValid,
    isHomeAssistantUserIdValid,
    isTimeValid,
} from './utils';

jest.useFakeTimers();

describe('asyncErrorHandler function', () => {
    it('should catch the error and call the next function', async () => {
        const next = jest.fn();
        const func = asyncErrorHandler(async (_request, _response) => {
            throw new Error('test error');
        });
        await func({} as Request, {} as Response, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new Error('test error'));
    });
});

type TestBody = {
    key1: unknown,
    key2: unknown,
};

describe('checkUnexpectedKeys function', () => {
    it('should return true', () => {
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        expect(checkUnexpectedKeys<TestBody>(
            { key1: 0, key2: 0 } as TestBody,
            ['key1', 'key2'],
            response as unknown as Response,
        )).toBe(true);
        expect(response.status).toHaveBeenCalledTimes(0);
        expect(response.json).toHaveBeenCalledTimes(0);
    });

    it('should return true if the keys are not present', () => {
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        expect(checkUnexpectedKeys<TestBody>(
            {} as TestBody,
            ['key1', 'key2'],
            response as unknown as Response,
        )).toBe(true);
        expect(response.status).toHaveBeenCalledTimes(0);
        expect(response.json).toHaveBeenCalledTimes(0);
    });

    it('should return false if there is an unexpected key', () => {
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        expect(checkUnexpectedKeys<TestBody>(
            { badKey: 0 },
            ['key1', 'key2'],
            response as unknown as Response,
        )).toBe(false);
        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({ message: 'Unexpected key: badKey' });
    });

    it('should return false if there is an multiple unexpecteds keys', () => {
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        expect(checkUnexpectedKeys<TestBody>(
            { badKey1: 0, badKey2: 0 },
            ['key1', 'key2'],
            response as unknown as Response,
        )).toBe(false);
        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Unexpected keys: badKey1, badKey2',
        });
    });
});

describe('isTimeValid function', () => {
    it('should return true for valid times', () => {
        expect(isTimeValid('00:00')).toBe(true);
        expect(isTimeValid('23:59')).toBe(true);
        expect(isTimeValid('19:19')).toBe(true);
    });

    it('should return false for invalid values', () => {
        expect(isTimeValid('00:61')).toBe(false);
        expect(isTimeValid('00:70')).toBe(false);
        expect(isTimeValid('30:00')).toBe(false);
        expect(isTimeValid('29:00')).toBe(false);

        expect(isTimeValid('')).toBe(false);
        expect(isTimeValid('00:00:00')).toBe(false);
        expect(isTimeValid('0:00')).toBe(false);

        expect(isTimeValid(undefined)).toBe(false);
        expect(isTimeValid(null)).toBe(false);
        expect(isTimeValid(4)).toBe(false);
        expect(isTimeValid(true)).toBe(false);
        expect(isTimeValid([])).toBe(false);
        expect(isTimeValid({})).toBe(false);
    });
});

describe('isDateValid function', () => {
    it('should return true for dates', () => {
        expect(isDateValid('2025-03-13')).toBe(true);
        expect(isDateValid('2026-01-01')).toBe(true);
        expect(isDateValid('2026-12-31')).toBe(true);
    });

    it('should return false for invalid values', () => {
        expect(isDateValid('2025-02-30')).toBe(false);
        expect(isDateValid('2026-04-31')).toBe(false);
        expect(isDateValid('2026-12-32')).toBe(false);
        expect(isDateValid('2026-12-45')).toBe(false);

        expect(isDateValid('')).toBe(false);
        expect(isDateValid('2026-12-45-12')).toBe(false);
        expect(isDateValid('2026-12-45 12:00')).toBe(false);

        expect(isDateValid(undefined)).toBe(false);
        expect(isDateValid(null)).toBe(false);
        expect(isDateValid(4)).toBe(false);
        expect(isDateValid(true)).toBe(false);
        expect(isDateValid([])).toBe(false);
        expect(isDateValid({})).toBe(false);
    });
});

describe('isHomeAssistantUserIdValid function', () => {
    it('should return true for valid home assistant user ids', () => {
        expect(isHomeAssistantUserIdValid('f78e8c3f87d4fb4e6421557ae1b247ba')).toBe(true);
        expect(isHomeAssistantUserIdValid('d5344927133d0aff6928f4c811714182')).toBe(true);
    });

    it('should return false for invalid values', () => {
        expect(isHomeAssistantUserIdValid('')).toBe(false);
        expect(isHomeAssistantUserIdValid('d5344927133d0af')).toBe(false);
        expect(isHomeAssistantUserIdValid(
            'f78e8c3f87d4fb4e6421557ae1b247bad5344927133d0aff6928f4c811714182',
        )).toBe(false);
        expect(isHomeAssistantUserIdValid('ABCDEF00000000000000000000000000')).toBe(false);
        expect(isHomeAssistantUserIdValid('#Z@Y:iz0000000000000000000000000')).toBe(false);

        expect(isHomeAssistantUserIdValid(undefined)).toBe(false);
        expect(isHomeAssistantUserIdValid(null)).toBe(false);
        expect(isHomeAssistantUserIdValid(4)).toBe(false);
        expect(isHomeAssistantUserIdValid(true)).toBe(false);
        expect(isHomeAssistantUserIdValid([])).toBe(false);
        expect(isHomeAssistantUserIdValid({})).toBe(false);
    });
});

describe('getNextDate function', () => {
    it('should return today’s date if the specified time is later in the day', () => {
        jest.setSystemTime(new Date('2025-03-13T10:00:00Z'));
        expect(getNextDate('12:00').getTime()).toBe(new Date('2025-03-13T10:00:00Z').getTime());
    });

    it('should return tomorrow’s date if the specified time has already passed today', () => {
        jest.setSystemTime(new Date('2025-03-13T14:00:00Z'));
        expect(getNextDate('12:00').getTime()).toBe(new Date('2025-03-14T14:00:00Z').getTime());
    });
});

describe('formatYear function', () => {
    it('should format the date to the format yyyy-mm-dd', () => {
        expect(formatDate(new Date('2025-03-13'))).toBe('2025-03-13');
        expect(formatDate(new Date('2030-12-01'))).toBe('2030-12-01');
    });
});

describe('BigTimeout class', () => {
    it('should call the callback after delay <= MAX_DELAY', () => {
        const callback = jest.fn();
        const delay = 1000;

        BigTimeout.set(callback, delay);

        jest.advanceTimersByTime(1);

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(delay - 2);

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should call the callback after delay > MAX_DELAY', () => {
        const callback = jest.fn();
        const delay = 4000000000;

        BigTimeout.set(callback, delay);

        jest.advanceTimersByTime(1);

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(delay - 2);

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should prevents callback from firing after delay <= MAX_DELAY', () => {
        const callback = jest.fn();
        const delay = 1000;

        const timeout = BigTimeout.set(callback, delay);

        timeout.clear();

        jest.advanceTimersByTime(delay);

        expect(callback).not.toHaveBeenCalled();
    });

    it(
        'should not call the callback if cleared during the first timeout when delay > MAX_DELAY',
        () => {
            const callback = jest.fn();
            const delay = 4000000000;

            const timeout = BigTimeout.set(callback, delay);

            timeout.clear();

            jest.advanceTimersByTime(delay);

            expect(callback).not.toHaveBeenCalled();
        },
    );

    it(
        'should not call the callback if cleared during a chained timeout when delay > MAX_DELAY',
        () => {
            const callback = jest.fn();
            const delay = 4000000000;

            const timeout = BigTimeout.set(callback, delay);

            jest.advanceTimersByTime(delay - 1);

            timeout.clear();

            jest.advanceTimersByTime(delay);

            expect(callback).not.toHaveBeenCalled();
        },
    );
});
