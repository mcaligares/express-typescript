import type { SequelizeOptions } from 'sequelize-typescript';
import { Sequelize } from 'sequelize-typescript';

import { logger } from '@/services/logger.service';

import config from './config/config';
import models from './models';

type ConnectionType = {
  sequelize: Sequelize | undefined
  alive: boolean
}

const connection: ConnectionType = {
  alive: false,
  sequelize: undefined,
};

export async function initializeDB() {
  try {
    const options: SequelizeOptions = {
      ...config,
      query: { raw: true },
    };
    const sequelize = new Sequelize(options);

    sequelize.addModels(models);
    await sequelize.sync();
    await sequelize.authenticate();
    connection.sequelize = sequelize;
    connection.alive = true;
    logger.debug('connected to db');
  } catch (e) {
    connection.alive = false;
    logger.error('Unable to connect to db:', e);
    throw e;
  }
}

export function getConnection() {
  if (connection.alive && connection.sequelize) {
    return connection.sequelize;
  }
  throw 'db connection is not alive';
}