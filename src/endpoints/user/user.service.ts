import type { Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import type { IUser, IUserWithID } from '@/models/i-user';
import type { IUserToken } from '@/models/i-user-token';
import * as userRepository from '@/repositories/user.repository';
import { encrypt } from '@/services/crypt.service';
import { getNextDayAt } from '@/utils/date.utils';
import { obfuscatePassword } from '@/utils/parse.utils';

import { getConnection } from '../../db';

type TransactionCallback<T> = (transaction: Transaction) => Promise<T>;

const USER_DEFAULT_VALUES = {
  needChangePassword: false,
  confirmed: false,
  enabled: false,
};

export async function withTransaction<T>(callback: TransactionCallback<T>) {
  const sequelize = getConnection();

  return await sequelize.transaction(async (t) => callback(t));
}

export async function createUser(params: IUser, transaction: Transaction): Promise<IUserWithID> {
  const { username, email } = params;
  const secretKey = process.env.SECRET_KEY_PASSWORD as string;
  const password = encrypt(params.password, secretKey);
  const newUser: IUser = { ...USER_DEFAULT_VALUES, username, email, password };
  const user = await userRepository.createUser(newUser, transaction);

  return obfuscatePassword(user);
}

export async function createConfirmationToken(params: IUserWithID, transaction: Transaction): Promise<IUserToken> {
  const userId = params.id;
  const token = uuidv4();
  const expiresIn = getNextDayAt(new Date());
  const userToken: IUserToken = { userId, token, type: 'confirmation-email', expiresIn };

  return await userRepository.createUserToken(userToken, transaction);
}

export async function confirmUserAccount(token: string) {
  const userToken = await userRepository.findUserToken(token);

  if (!userToken) {
    return false;
  }
  if (userToken.expiresIn < new Date()) {
    await userRepository.deleteUserToken(userToken.id);

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

export function getAllUsers(): Promise<IUser[]> {
  return userRepository.getAllUsers();
}
