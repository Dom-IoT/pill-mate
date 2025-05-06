import express from 'express';
import morgan from 'morgan';

import { createLogger } from './logger';
import homeAssistantRoutes from './routes/homeAssistantRoutes';
import medicationRoutes from './routes/medicationRoutes';
import reminderRoutes from './routes/reminderRoutes';
import userRoutes from './routes/userRoutes';
import { homeAssistantHeaders } from './middlewares/homeAssistantHeaders';
import { errorHandling } from './middlewares/errorHandling';
import { applicationJson } from './middlewares/applicationJson';

const app = express();

const expressLogger = createLogger('express');

app.use(morgan('dev', {
    stream: {
        write: message => expressLogger.http(message.trim()),
    },
}));

app.use(applicationJson);
app.use(express.json());

app.use(homeAssistantHeaders);

app.use('/homeassistant', homeAssistantRoutes);
app.use('/medication', medicationRoutes);
app.use('/reminder', reminderRoutes);
app.use('/user', userRoutes);

app.use(errorHandling);

export default app;
