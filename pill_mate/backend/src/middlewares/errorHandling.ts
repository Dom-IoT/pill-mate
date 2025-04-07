import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../logger';
import { HTTP_500_INTERNAL_SERVER_ERROR } from '../status';

const backendLogger = createLogger('backend');

export const errorHandling = (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction,
) => {
    backendLogger.error(error);
    if (error instanceof Error) {
        backendLogger.debug(error.stack);
    }
    response
        .status(HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.' });
};
