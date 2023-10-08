import type { IUser, IUserWithID } from 'models/i-user';
import type { WhereOptions } from 'sequelize';
import { Op, type Transaction } from 'sequelize';

import type { IUserIdAndEnable } from '@/endpoints/user/user.types';
import type { IUserToken, IUserTokenWithID } from '@/models/i-user-token';
import { Logger } from '@/services/logger.service';
import { obfuscatePassword } from '@/utils/parse.utils';

import User from '../db/models/user';
import UserToken from '../db/models/usertoken';

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

export async function updateUser(user: IUserWithID): Promise<IUserWithID> {
  logger.debug('updating user', user);

  await User.update({
    email: user.email,
    username: user.username,
  }, {
    where: { id: user.id }
  });

  return await User.findByPk(user.id, {
    attributes: { exclude: ['password'] }
  }) as IUserWithID;
}

export async function setEnableUser(user: IUserIdAndEnable): Promise<IUserWithID> {
  logger.debug('enabling user', user);

  await User.update({
    enabled: user.enable
  }, {
    where: { id: user.id }
  });

  return await User.findByPk(user.id, {
    attributes: { exclude: ['password'] }
  }) as IUserWithID;
}

export async function createUserToken(userToken: IUserToken, transaction?: Transaction): Promise<IUserTokenWithID> {
  logger.debug('creating user token', userToken);

  const entity = await UserToken.create({
    expiresIn: userToken.expiresIn,
    userId: userToken.userId,
    token: userToken.token,
    type: userToken.type,
  }, { transaction });

  return entity.get();
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

type SetPasswordParams = ConfirmParams & {
  password: string
}

export async function setPasswordWithUserToken(params: SetPasswordParams) {
  await deleteUserToken(params.userTokenId, params.transaction);
  await User.update({
    password: params.password,
    needChangePassword: false,
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

export async function getAllUsers(filter: Partial<IUser>): Promise<IUser[]> {
  logger.debug('getting users with filter', filter);

  const where: WhereOptions<User> = {};

  if (filter.enabled !== undefined) {
    where.enabled = filter.enabled;
  }
  if (filter.confirmed !== undefined) {
    where.confirmed = filter.confirmed;
  }
  if (filter.email && filter.email.trim()) {
    where.email = { [Op.iLike]: `%${filter.email}%` };
  }
  if (filter.username && filter.username.trim()) {
    where.username = { [Op.iLike]: `%${filter.username}%` };
  }

  return await User.findAll({
    where,
    attributes: { exclude: ['password'] }
  });
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

export async function deleteUser(userId: number, transaction: Transaction) {
  await User.destroy({
    where: { id: userId },
    transaction
  });
  await UserToken.destroy({
    where: { userId },
    transaction,
  });
}
