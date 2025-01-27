import { Sequelize } from 'sequelize-typescript';

import { logger } from './logger';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: message => logger.log({ level: 'debug', message: `sequelize: ${message}` }),
    models: [],
});
