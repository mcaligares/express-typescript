import type { Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import type { IUser, IUserWithID } from '@/models/i-user';
import type { IUserToken, UserTokenType } from '@/models/i-user-token';
import * as userRepository from '@/repositories/user.repository';
import { encrypt } from '@/services/crypt.service';
import { Logger } from '@/services/logger.service';
import { getDaysAt, getNextDayAt } from '@/utils/date.utils';
import { obfuscatePassword } from '@/utils/parse.utils';

import { getConnection } from '../../db';
import type { IChangePasswordUserToken, IUserFilter } from './user.types';

const logger = new Logger('UserService');

type TransactionCallback<T> = (transaction: Transaction) => Promise<T>;

const USER_DEFAULT_VALUES = {
  enabled: true,
  confirmed: false,
  needChangePassword: false,
};

export async function withTransaction<T>(callback: TransactionCallback<T>) {
  return await getConnection().transaction(async (t) => callback(t));
}

export async function createUser(params: IUser, transaction: Transaction): Promise<IUserWithID> {
  const password = encryptPassword(params.password);
  const newUser = buildNewUser({ ...params, password });
  const user = await userRepository.createUser(newUser, transaction);
  const result = obfuscatePassword(user);

  logger.debug('created user', result);

  return result;
}

function buildNewUser(user: IUser): IUser {
  return {
    ...USER_DEFAULT_VALUES,
    email: user.email,
    username: user.username,
    password: user.password,
    needChangePassword: user.needChangePassword,
  };
}

function encryptPassword(password: string) {
  const secretKey = process.env.SECRET_KEY_PASSWORD as string;

  return encrypt(password, secretKey);
}

type CreateTokenParams = {
  user: IUserWithID
  type: UserTokenType
  transaction: Transaction
}

export async function createToken(params: CreateTokenParams): Promise<IUserToken> {
  const token = uuidv4();
  const userId = params.user.id;
  const expiresIn = getExpirationDateByTokenType(params.type);
  const userToken: IUserToken = { userId, token, expiresIn, type: params.type };
  const result = await userRepository.createUserToken(userToken, params.transaction);

  logger.debug('created user token', result);

  return result;
}

function getExpirationDateByTokenType(type: UserTokenType) {
  if (type === 'change-password') {
    return getDaysAt(new Date(), 30);
  } else if (type === 'confirmation-email') {
    return getNextDayAt(new Date());
  } else {
    return new Date();
  }
}

export async function confirmUserAccount(token: string) {
  const userToken = await getAndValidateUserToken(token, 'confirmation-email');

  if (!userToken) {
    return false;
  }

  await withTransaction(async (transaction) => {
    await userRepository.confirmUserToken({
      userId: userToken.userId,
      userTokenId: userToken.id,
      transaction,
    });
  });

  return true;
}

async function getAndValidateUserToken(token: string, type: UserTokenType) {
  const userToken = await userRepository.findUserToken(token);

  if (!userToken) {
    return undefined;
  }
  if (userToken.type !== type) {
    return undefined;
  }
  if (userToken.expiresIn < new Date()) {
    await userRepository.deleteUserToken(userToken.id);

    return undefined;
  }

  return userToken;
}

export async function setUserPassword(params: IChangePasswordUserToken) {
  const password = encryptPassword(params.password);
  const userToken = await getAndValidateUserToken(params.token, 'change-password');

  if (!userToken) {
    return false;
  }

  await withTransaction(async (transaction) => {
    await userRepository.setPasswordWithUserToken({
      userId: userToken.userId,
      userTokenId: userToken.id,
      transaction,
      password,
    });
  });

  return true;
}


export function getAllUsers(params: IUserFilter): Promise<IUser[]> {
  return userRepository.getAllUsers(params);
}

export async function updateUser(params: IUserWithID): Promise<IUserWithID> {
  const { id, email, username } = params;
  const user = { id, email, username } as IUserWithID;

  return await userRepository.updateUser(user);
}

export async function enableUser(userIdParam: string, enable: boolean): Promise<IUserWithID> {
  const userId = Number(userIdParam);

  if (!userId) {
    throw 'invalid id';
  }

  const user = { id: userId, enable };

  return await userRepository.setEnableUser(user);
}

export async function deleteUser(userIdParam: string) {
  const userId = Number(userIdParam);

  if (!userId) {
    throw 'invalid id';
  }
  await withTransaction(async (transaction) => {
    await userRepository.deleteUser(userId, transaction);
  });
}
