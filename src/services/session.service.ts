require('dotenv').config();

import type { Request } from 'express';

import type { IRequest } from '@/models/i-request';
import type { ISession } from '@/models/i-session';
import type { IUserWithID } from '@/models/i-user';
import { getUserById } from '@/repositories/user.repository';

import { decodeToken } from './token.service';

type DecodedSession<T> = { payload: T, iat: number };

export async function getSession(req: IRequest): Promise<Omit<ISession, 'accessToken'> | undefined> {
  if (req.session) {
    return req.session;
  }

  const token = getTokenFromHeader(req);

  if (!token) {
    return undefined;
  }

  const secretKey = process.env.SECRET_KEY_TOKEN as string;
  const decodedToken = decodeToken(token, secretKey) as DecodedSession<IUserWithID>;
  const user = await getUserById(decodedToken?.payload?.id);

  return user ? { user } : undefined;
}

function getTokenFromHeader(req: Request): string | undefined {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return undefined;
  }
  if (authHeader.split(' ').length != 2) {
    return undefined;
  }

  return authHeader.split(' ')[1];
}