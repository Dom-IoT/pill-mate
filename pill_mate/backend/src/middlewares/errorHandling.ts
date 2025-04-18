import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../logger';
import { HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR } from '../status';

const NODE_ENV = process.env.NODE_ENV || 'production';

const backendLogger = createLogger('backend');

export const errorHandling = (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction,
) => {
    if (error instanceof SyntaxError &&
        (error as unknown as { status: number }).status === 400 &&
        'body' in error) {
        // It's an error throwed by the JSON parser.
        const message = NODE_ENV === 'development' ? error.message : 'Invalid JSON body.';
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message });
        return;
    }
    backendLogger.error(error);
    if (error instanceof Error) {
        backendLogger.debug(error.stack);
    }
    response
        .status(HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.' });
};
