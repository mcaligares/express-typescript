import jwt from 'jsonwebtoken';

import { Logger } from '@/services/logger.service';

const logger = new Logger('TokenService');

export function generateToken(payload: unknown, secretKey: string) {
  if (!payload) {
    throw new Error('Error generating token. Invalid payload');
  }
  if (!secretKey) {
    throw new Error('Error generating token. Invalid secret key');
  }

  try {
    return jwt.sign({ payload }, secretKey);
  } catch (e) {
    logger.error('Error generating access token', e);
    throw e;
  }
}

export function decodeToken(token: string, secretKey: string) {
  if (!token) {
    throw new Error('Error decoding token. Invalid token');
  }
  if (!secretKey) {
    throw new Error('Error decoding token. Invalid secret key');
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    return decoded as unknown;
  } catch (e) {
    logger.error('Error decoding token', token, e);
    throw e;
  }
}
