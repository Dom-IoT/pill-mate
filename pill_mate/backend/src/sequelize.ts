import { Sequelize } from 'sequelize-typescript';

import { createLogger } from './logger';
import { Medication } from './models/Medication';
import { Reminder } from './models/Reminder';
import { User, UserHelp } from './models/User';

const logger = createLogger('sequelize');

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/homeassistant/home-assistant_v2.db',
    logging: message => logger.debug(message),
    models: [Medication, Reminder, User, UserHelp],
    hooks: {
        beforeDefine: (_, model) => {
            model.tableName = `pillmate_${model.name?.plural}`;
        },
    },
});
