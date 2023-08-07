import type { IUser } from 'models/i-user';
import type { UserAttributes } from 'db/models/user';
import { encrypt } from 'services/crypt.service';
import * as userRepository from 'repositories/user.repository';

const userDefaultValues = {
  needChangePassword: false,
  confirmed: false,
  enabled: false,
};

export async function createNewUser(params: IUser): Promise<UserAttributes> {
  const { name, email } = params;
  const secretKey = process.env.SECRET_KEY as string;
  const password = encrypt(params.password, secretKey);
  const newUser: IUser = { ...userDefaultValues, name, email, password };
  const user = await userRepository.createUser(newUser);

  user.password = '';

  return user.toJSON();
}

export function getAllUsers(): Promise<UserAttributes[]> {
  return userRepository.getAllUsers();
}
