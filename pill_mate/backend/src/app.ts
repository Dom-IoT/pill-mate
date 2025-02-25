import express, { Request, Response } from 'express';
import morgan from 'morgan';

import { createLogger } from './logger';

const app = express();

const logger = createLogger('express');

app.use(morgan('dev', {
    stream: {
        write: message => logger.http(message.trim()),
    },
}));

app.use(express.json());
});

export default app;
