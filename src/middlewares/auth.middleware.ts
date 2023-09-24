require('dotenv').config();

import type { NextFunction, Response } from 'express';
import type { IRequest } from 'models/i-request';
import type { ISession } from 'models/i-session';
import { Logger } from 'services/logger.service';
import { decodeToken } from 'services/token.service';

const logger = new Logger('AuthMiddleware');

export function authMiddleware(req: IRequest, res: Response, next: NextFunction) {
  logger.debug('authenticating request...');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const secretKey = process.env.SECRET_KEY_TOKEN as string;

  if (!token) {
    logger.debug('token is empty or invalid');

    return res.sendStatus(401);
  }

  try {
    req.session = decodeToken(token, secretKey) as ISession;
    next();
  } catch (e) {
    logger.error('Error authenticating request', e);

    res.sendStatus(403);
  }
}
