import express, { Request, Response } from 'express';
import morgan from 'morgan';

import { logger } from './logger';

const app = express();

app.use(morgan('dev', {
    stream: {
        write: message => logger.http(message.trim()),
    },
}));


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

export default app;
