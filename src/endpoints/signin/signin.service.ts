require('dotenv').config();

import { Logger } from 'services/logger.service';
import type { IUser } from 'models/i-user';
import type { ISession } from 'models/i-session';
import type { SigninWithEmailRequest, SigninWithUsernameRequest } from './signin.types';
import * as userRepository from 'repositories/user.repository';
import { generateToken } from 'services/token.service';

const logger = new Logger('SigninService');

type Payload = SigninWithEmailRequest | SigninWithUsernameRequest;

export async function signin(payload: Payload): Promise<ISession> {
  const user = await findUser(payload);
  const accessToken = generateAccessToken(user);

  logger.info('signing successfully', user);

  return { user, accessToken };
}

async function findUser(payload: Payload): Promise<IUser> {
  if ('email' in payload) {
    return await userRepository.findUserByEmailAndPassword(payload.email, payload.password);
  } else if ('username' in payload) {
    return await userRepository.findUserByUsernameAndPassword(payload.username, payload.password);
  } else {
    throw new Error('Error getting user, expect email or username property');
  }
}

function generateAccessToken(user: IUser): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY as string;

  return generateToken(user, accessTokenSecret);
}
