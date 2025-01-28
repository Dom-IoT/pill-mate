import { Sequelize } from 'sequelize-typescript';

import { logger } from './logger';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/homeassistant/home-assistant_v2.db',
    logging: message => logger.log({ level: 'debug', message: `sequelize: ${message}` }),
    models: [],
    hooks: {
        beforeDefine: (_, model) => {
            model.tableName = `pillmate_${model.name?.plural}`;
        },
    },
});
