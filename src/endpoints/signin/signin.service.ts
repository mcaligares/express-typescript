require('dotenv').config();

import { Logger } from 'services/logger.service';
import type { IUser } from 'models/i-user';
import type { ISession } from 'models/i-session';
import type { SigninWithEmailRequest, SigninWithUsernameRequest } from './signin.types';
import { decrypt } from 'services/crypt.service';
import { generateToken } from 'services/token.service';
import * as userRepository from 'repositories/user.repository';

const logger = new Logger('SigninService');

type Payload = SigninWithEmailRequest | SigninWithUsernameRequest;

export async function signin(payload: Payload): Promise<ISession | undefined> {
  const foundUser = await findUser(payload);
  const isValid = comparePassword(payload.password, foundUser?.password);

  if (!isValid) {
    logger.debug('user not found', payload);

    return undefined;
  }

  const user = { ...foundUser, password: '' } as IUser;
  const accessToken = generateAccessToken(user);

  logger.info('signing successfully', user);

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


function comparePassword(password: string, encodedPassword?: string): boolean {
  if (!encodedPassword) {
    return false;
  }

  const secretKey = process.env.SECRET_KEY as string;
  const decodedPassword = decrypt(encodedPassword, secretKey);

  return decodedPassword === password;
}

function generateAccessToken(user: IUser): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY as string;

  return generateToken(user, accessTokenSecret);
}
