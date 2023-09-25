import type { IUser } from '@/models/i-user';
import * as userRepository from '@/repositories/user.repository';
import { encrypt } from '@/services/crypt.service';

const userDefaultValues = {
  needChangePassword: false,
  confirmed: false,
  enabled: false,
};

export async function createNewUser(params: IUser): Promise<IUser> {
  const { username, email } = params;
  const secretKey = process.env.SECRET_KEY_PASSWORD as string;
  const password = encrypt(params.password, secretKey);
  const newUser: IUser = { ...userDefaultValues, username, email, password };
  const user = await userRepository.createUser(newUser);

  user.password = '';

  return user;
}

export function getAllUsers(): Promise<IUser[]> {
  return userRepository.getAllUsers();
}
