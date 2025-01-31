import { Sequelize } from 'sequelize-typescript';

import { createLogger } from './logger';

const logger = createLogger('sequelize');

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/homeassistant/home-assistant_v2.db',
    logging: message => logger.debug(message),
    models: [],
    hooks: {
        beforeDefine: (_, model) => {
            model.tableName = `pillmate_${model.name?.plural}`;
        },
    },
});
