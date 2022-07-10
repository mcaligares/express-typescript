import { Logger } from 'services/logger.service';
import User from '../db/models/user';
import type { UserAttributes } from '../db/models/user';
import type { IUser } from 'models/i-user';

const logger = new Logger('Repository - User');

export async function createUser(user: IUser) {
  logger.info('creating user', user);

  return await User.create(user as UserAttributes);
}

export async function getAllUsers() {
  logger.info('getting all users');

  return await User.findAll();
}
