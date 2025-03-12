import { NextFunction, Request, Response } from 'express';

export const asyncErrorHandler = (func: (req: Request, res: Response) => Promise<void>) => {
    return (request: Request, response: Response, next: NextFunction) => {
        Promise.resolve(func(request, response)).catch(next);
    };
};
