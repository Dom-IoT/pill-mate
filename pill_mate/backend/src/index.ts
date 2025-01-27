import { config } from 'dotenv';

config({ path: '../.env' });

import app from './app';
import { logger } from './logger';
import { sequelize } from './sequelize';

const port = process.env.BACKEND_PORT || 3000;

(async () => {
    await sequelize.sync({ alter: { drop: false } });

    app.listen(port, () => {
        logger.info(`Server running at http://localhost:${port}`);
    });
})();
