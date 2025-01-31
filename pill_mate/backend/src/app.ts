import express, { Request, Response } from 'express';
import morgan from 'morgan';

import { createLogger } from './logger';
import HomeAssistant from './homeassistant';

const HOME_ASSISTANT_SUPERVISOR_TOKEN = process.env.SUPERVISOR_TOKEN || '';

const homeassistant = new HomeAssistant(HOME_ASSISTANT_SUPERVISOR_TOKEN);

const app = express();

const logger = createLogger('express');

app.use(morgan('dev', {
    stream: {
        write: message => logger.http(message.trim()),
    },
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

export default app;
