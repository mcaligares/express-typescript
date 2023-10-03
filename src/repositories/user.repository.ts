import type { IUser, IUserWithID } from 'models/i-user';
import type { Transaction } from 'sequelize';

import type { IUserToken, IUserTokenWithID } from '@/models/i-user-token';
import { Logger } from '@/services/logger.service';
import { obfuscatePassword } from '@/utils/parse.utils';

import User from '../db/models/user';
import UserToken from '../db/models/UserToken';

const logger = new Logger('UserRespository');

export async function createUser(user: IUser, transaction?: Transaction): Promise<IUserWithID> {
  logger.debug('creating user', obfuscatePassword(user));

  return await User.create({
    email: user.email,
    username: user.username,
    password: user.password,
    needChangePassword: !!user.needChangePassword,
    confirmed: !!user.confirmed,
    enabled: !!user.enabled,
  }, { transaction }) as IUserWithID;
}

export async function createUserToken(userToken: IUserToken, transaction?: Transaction): Promise<IUserTokenWithID> {
  logger.debug('creating user token', userToken);

  return await UserToken.create({
    expiresIn: userToken.expiresIn,
    userId: userToken.userId,
    token: userToken.token,
    type: userToken.type,
  }, { transaction }) as IUserTokenWithID;
}

export async function findUserToken(userToken: string) {
  logger.debug('finding user token', userToken);

  return await UserToken.findOne({
    where: { token: userToken }
  }) as IUserTokenWithID;
}

type ConfirmParams = {
  userId: number
  userTokenId: number
  transaction: Transaction
}

export async function confirmUserToken(params: ConfirmParams) {
  await deleteUserToken(params.userTokenId, params.transaction);
  await User.update({
    confirmed: true
  }, {
    where: { id: params.userId },
    transaction: params.transaction,
  });
}

export async function deleteUserToken(userTokenId: number, transaction?: Transaction) {
  await UserToken.destroy({
    where: { id: userTokenId },
    transaction: transaction,
  });
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
