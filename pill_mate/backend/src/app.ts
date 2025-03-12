import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import { createLogger } from './logger';
import userRoutes from './routes/userRoutes';
import {
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
} from './status';

const app = express();

const expressLogger = createLogger('express');
const backendLogger = createLogger('backend');

app.use(morgan('dev', {
    stream: {
        write: message => expressLogger.http(message.trim()),
    },
}));

app.use(express.json());

app.use((request: Request, response: Response, next) => {
    const homeAssistantUserId = request.get('x-remote-user-id');
    if (homeAssistantUserId === undefined) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'Missing required header: x-remote-user-id.' });
        return;
    }
    request.homeAssistantUserId = homeAssistantUserId;

    const homeAssistantUserName = request.get('x-remote-user-name');
    if (homeAssistantUserName === undefined) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'Missing required header: x-remote-user-name.' });
        return;
    }
    request.homeAssistantUserName = homeAssistantUserName;

    const homeAssistantUserDisplayName = request.get('x-remote-user-display-name');
    if (homeAssistantUserDisplayName === undefined) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'Missing required header: x-remote-user-display-name.' });
        return;
    }
    request.homeAssistantUserDisplayName = homeAssistantUserDisplayName;

    next();
});

app.use('/user', userRoutes);

app.use((error: unknown, request: Request, response: Response, _next: NextFunction) => {
    backendLogger.error(error);
    if (error instanceof Error) {
        backendLogger.debug(error.stack);
    }
    response
        .status(HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.' });
});

export default app;
