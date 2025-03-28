import { isDateValid, isHomeAssistantUserIdValid, isTimeValid } from './utils';

describe('asyncErrorHandler function', () => {
    // TODO
    it('TODO', () => {
        expect(true).toBe(false);
    });
});

describe('checkUnexpectedKeys function', () => {
    // TODO
    it('TODO', () => {
        expect(true).toBe(false);
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
