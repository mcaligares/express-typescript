require('dotenv').config();

import type { Request } from 'express';

import type { IRequest } from '@/models/i-request';
import type { ISession } from '@/models/i-session';
import type { IUserWithID } from '@/models/i-user';

import { decodeToken } from './token.service';

type DecodedSessionToken<T> = { payload: T, iat: number };

export function getSession(req: IRequest): Omit<ISession, 'accessToken'> | undefined {
  if (req.session) {
    return req.session;
  }

  const token = getTokenFromHeader(req);

  if (!token) {
    return undefined;
  }

  const secretKey = process.env.SECRET_KEY_TOKEN as string;
  const decodedToken = decodeToken(token, secretKey) as DecodedSessionToken<IUserWithID>;

  return { user: decodedToken.payload };
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