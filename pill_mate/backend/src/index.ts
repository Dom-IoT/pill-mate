import { config } from 'dotenv';

config({ path: '../.env' });

import app from './app';
import { HomeAssistant } from './homeassistant';
import { createLogger } from './logger';
import { ReminderService } from './services/reminderService';
import { sequelize } from './sequelize';

const SUPERVISOR_TOKEN = process.env.SUPERVISOR_TOKEN;
const PORT = process.env.BACKEND_PORT || 3000;

const logger = createLogger('backend');

(async () => {
    if (SUPERVISOR_TOKEN === undefined) {
        logger.error('SUPERVISOR_TOKEN is not set');
        process.exit(1);
    }

    await Promise.all([
        sequelize.sync({ alter: { drop: false } }).then(() => ReminderService.initAllTimeouts()),
        HomeAssistant.create(SUPERVISOR_TOKEN),
    ]);

    app.listen(PORT, () => {
        logger.info(`Server running at http://localhost:${PORT}`);
    });
})();
