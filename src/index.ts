require('module-alias/register');

import dotenv from 'dotenv';
import { setupServer } from './server';
import { initializeDB } from './db';
import { logger } from 'services/logger.service';

dotenv.config();

(async function init() {
  try {
    const port = process.env.APP_PORT;

    logger.info('starting...');
    const app = setupServer();

    logger.info('initializing database...');
    await initializeDB();

    logger.info('initializing server...');
    app.listen(port, () => {
      logger.info(`server running in port ${port}`);
    });

  } catch (e) {
    logger.error('ERROR starting server', e);
  }
})();
