import type { IUser } from '@/models/i-user';
import * as userRepository from '@/repositories/user.repository';
import { encrypt } from '@/services/crypt.service';
import { obfuscatePassword } from '@/utils/parse.utils';

const USER_DEFAULT_VALUES = {
  needChangePassword: false,
  confirmed: false,
  enabled: false,
};

export async function createUser(params: IUser): Promise<IUser> {
  const { username, email } = params;
  const secretKey = process.env.SECRET_KEY_PASSWORD as string;
  const password = encrypt(params.password, secretKey);
  const newUser: IUser = { ...USER_DEFAULT_VALUES, username, email, password };
  const user = await userRepository.createUser(newUser);

  return obfuscatePassword(user);
}

export function getAllUsers(): Promise<IUser[]> {
  return userRepository.getAllUsers();
}
