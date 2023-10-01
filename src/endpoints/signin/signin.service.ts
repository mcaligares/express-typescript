require('dotenv').config();

import type { ISession } from '@/models/i-session';
import type { IUser } from '@/models/i-user';
import * as userRepository from '@/repositories/user.repository';
import { decrypt } from '@/services/crypt.service';
import { Logger } from '@/services/logger.service';
import { generateToken } from '@/services/token.service';
import { obfuscatePassword } from '@/utils/parse.utils';

import type { SigninWithEmailRequest, SigninWithUsernameRequest } from './signin.types';

const logger = new Logger('SigninService');

type Payload = SigninWithEmailRequest | SigninWithUsernameRequest;

export async function signin(payload: Payload): Promise<ISession | undefined> {
  const foundUser = await findUser(payload);

  if (!foundUser) {
    logger.debug('wrong email or username', payload);

    return undefined;
  }

  const isValid = comparePassword(payload.password, foundUser.password);

  if (!isValid) {
    logger.debug('wrong password', payload);

    return undefined;
  }

  const user = obfuscatePassword(foundUser);
  const accessToken = generateAccessToken(user);

  logger.debug('logged user and generated access token', user);

  return { user, accessToken };
}

async function findUser(payload: Payload): Promise<IUser | undefined> {
  const params: Partial<{ email: string, username: string }> = {};

  if ('email' in payload) {
    params.email = payload.email;
  } else {
    params.username = payload.username;
  }

  return await userRepository.findUserByEmailOrUsername(params);
}

function comparePassword(password: string, encodedPassword: string): boolean {
  const secretKey = process.env.SECRET_KEY_PASSWORD as string;
  const decodedPassword = decrypt(encodedPassword, secretKey);

  return decodedPassword === password;
}

function generateAccessToken(user: IUser): string {
  const accessTokenSecret = process.env.SECRET_KEY_TOKEN as string;

  return generateToken(user, accessTokenSecret);
}
