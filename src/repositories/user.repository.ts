import type { IUser } from 'models/i-user';

import { Logger } from '@/services/logger.service';

import User from '../db/models/user';

const logger = new Logger('Repository - User');

export async function createUser(user: IUser): Promise<IUser> {
  logger.info('creating user', user);

  return await User.create({
    email: user.email,
    username: user.username,
    password: user.password,
    needChangePassword: !!user.needChangePassword,
    confirmed: !!user.confirmed,
    enabled: !!user.enabled,
  } as IUser);
}

export async function getAllUsers(): Promise<IUser[]> {
  logger.info('getting all users');

  return await User.findAll();
}

type EmailOrUsername = Partial<{ email: string, username: string }>;

export async function findUserByEmailOrUsername(params: EmailOrUsername): Promise<IUser | undefined> {
  let user: IUser;

  if (params.email) {
    logger.info('finding user by email', params.email);
    user = await User.findOne({ where: { email: params.email } });
  } else if (params.username) {
    logger.info('finding user by name', params.username);
    user = await User.findOne({ where: { username: params.username } });
  } else {
    return undefined;
  }

  return user;
}
