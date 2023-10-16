import type { NextFunction, Response } from 'express';

import type { IRequest } from '@/models/i-request';
import { createResponse } from '@/services/controller.service';
import { Logger } from '@/services/logger.service';
import { getSession } from '@/services/session.service';

const logger = new Logger('AuthenticationMiddleware');

export function authenticationMiddleware(req: IRequest, res: Response, next: NextFunction) {
  try {
    logger.debug('authenticating request...');
    const session = getSession(req);

    if (!session) {
      logger.debug('token is empty or invalid');

      return createResponse(401, false)
        .withLogger(logger)
        .send(res);
    }

    req.session = session;
    logger.debug('request authenticated');
    next();
  } catch (e) {
    logger.error('Error authenticating request', e);

    return createResponse(403, false)
      .withLogger(logger)
      .send(res);
  }
}
