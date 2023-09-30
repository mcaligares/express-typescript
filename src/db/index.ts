import { Sequelize } from 'sequelize-typescript';

import { logger } from '@/services/logger.service';

import config from './config/config';
import models from './models';

export async function initializeDB() {
  try {
    const options = { ...config, query: { raw: true } };
    const sequelize = new Sequelize(options);

    sequelize.addModels(models);
    await sequelize.sync();
    await sequelize.authenticate();
    logger.debug('connected to db');
  } catch (e) {
    logger.error('Unable to connect to db:', e);
    throw e;
  }
}
