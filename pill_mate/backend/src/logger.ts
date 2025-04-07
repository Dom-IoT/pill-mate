import winston from 'winston';

export const createLogger = (label: string) => winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.label({ label, message: true }),
        winston.format.padLevels(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        }),
    ),
    transports: [new winston.transports.Console()],
});
