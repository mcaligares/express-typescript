import { logger } from 'services/logger.service';

export function afterCreateUser() {
  logger.info('user hook');

}
