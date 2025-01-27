import { config } from 'dotenv';

config({ path: '../.env' });

import app from './app';
import { sequelize } from './sequelize';

const port = process.env.BACKEND_PORT || 3000;

(async () => {
    await sequelize.sync({ alter: { drop: false } });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})();
