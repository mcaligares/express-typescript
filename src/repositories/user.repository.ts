import { Logger } from 'services/logger.service';
import type { UserAttributes } from '../db/models/user';
import type { IUser } from 'models/i-user';
import User from '../db/models/user';

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

type EmailOrName = Partial<{ email: string, name: string }>;

export async function findUserByEmailOrUsername(params: EmailOrName): Promise<UserAttributes | undefined> {
  let user: { toJSON: () => UserAttributes };

  if (params.email) {
    logger.info('finding user by email', params.email);
    user = await User.findOne({ where: { email: params.email } });
  } else if (params.name) {
    logger.info('finding user by name', params.name);
    user = await User.findOne({ where: { name: params.name } });
  } else {
    return undefined;
  }

  return user?.toJSON();
}
