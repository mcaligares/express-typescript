import { logger } from '@/services/logger.service';

import { sequelize } from './models';

export async function initializeDB() {
  try {
    await sequelize.authenticate();
    logger.debug('connected to db');
  } catch (e) {
    logger.error('Unable to connect to db:', e);
    throw e;
  }
}