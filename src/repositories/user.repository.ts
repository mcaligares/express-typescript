import { Logger } from 'services/logger.service';
import User from '../db/models/user';
import type { UserAttributes } from '../db/models/user';
import type { IUser } from 'models/i-user';

const logger = new Logger('Repository - User');

export async function createUser(user: IUser) {
  logger.info('creating user', user);

  return await User.create({
    email: user.email,
    name: user.name,
    password: user.password,
    needChangePassword: !!user.needChangePassword,
    confirmed: !!user.confirmed,
    enabled: !!user.enabled,
  } as UserAttributes);
}

export async function getAllUsers() {
  logger.info('getting all users');

  return await User.findAll();
}

export async function findUserByEmailAndPassword(email: string, password: string) {
  logger.info('finding user by email and password', email);

  return await User.findOne({ where: { email, password } });
}

export async function findUserByUsernameAndPassword(username: string, password: string) {
  logger.info('finding user by username and password', username);

  return await User.findOne({ where: { name: username, password } });
}
