import express, { Request, Response } from 'express';
import morgan from 'morgan';

import { createLogger } from './logger';
import homeassistant from './homeassistant';
import userRoutes from './routes/userRoutes';
import { HTTP_400_BAD_REQUEST } from './status';

const app = express();

const expressLogger = createLogger('express');

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

});

export default app;
