import type { IUser } from 'models/i-user';

import { Logger } from '@/services/logger.service';
import { obfuscatePassword } from '@/utils/parse.utils';

import User from '../db/models/User';

const logger = new Logger('UserRespository');

export async function createUser(user: IUser): Promise<IUser> {
  logger.debug('creating user', obfuscatePassword(user));

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
  logger.debug('getting all users');

  return await User.findAll();
}

type EmailOrUsername = Partial<{ email: string, username: string }>;

export async function findUserByEmailOrUsername(params: EmailOrUsername): Promise<IUser | undefined> {
  let user: User | null;

  logger.debug('finding user by email or username', params);
  if (params.email) {
    user = await User.findOne({ where: { email: params.email } });
  } else if (params.username) {
    user = await User.findOne({ where: { username: params.username } });
  } else {
    return undefined;
  }

  return user ? user as IUser : undefined;
}
