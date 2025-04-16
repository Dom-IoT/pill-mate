import { Request, Response } from 'express';

import { errorHandling } from './errorHandling';

describe('errorHandling middleware', () => {
    it('should return 400 if the error is a JSON parsing syntax error', () => {
        const response = {
            status: jest.fn(),
            json: jest.fn(),
        };
        response.status.mockReturnValue(response);
        const next = jest.fn();
        const error = new SyntaxError() as unknown as { status: number, body: string };
        error.status = 400;
        error.body = '{ syntaxError: }';
        errorHandling(error, {} as Request, response as unknown as Response, next);
        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Invalid JSON body.',
        });
        expect(next).toHaveBeenCalledTimes(0);
    });

    it('should return 500', () => {
        const response = {
            status: jest.fn(),
            json: jest.fn(),
        };
        response.status.mockReturnValue(response);
        const next = jest.fn();
        errorHandling(new Error(), {} as Request, response as unknown as Response, next);
        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Internal Server Error.',
        });
        expect(next).toHaveBeenCalledTimes(0);
    });
});
