import type { NextFunction, Response } from 'express';

import type { IRequest } from '@/models/i-request';
import type { AuthRouteKey } from '@/routes/authorization.route';
import { authRouteMap } from '@/routes/authorization.route';
import { createResponse } from '@/services/controller.service';
import { Logger } from '@/services/logger.service';

const logger = new Logger('AuthorizationMiddleware');

export function authorizationMiddleware(req: IRequest, res: Response, next: NextFunction, path?: AuthRouteKey) {
  try {
    logger.debug('authorization request...');

    if (!req.isAuthenticated) {
      return createResponse(403, false)
        .withLogger(logger)
        .send(res);
    }

    const session = req.session;
    const route = authRouteMap.find(map => map.key === path);

    if (route && session && route.allowedRoles.includes(session.user.role)) {
      logger.debug('request authorized');
      next();
    } else if (!route) {
      logger.debug('request dont need authorization');
      next();
    } else {
      return createResponse(403, false)
        .withLogger(logger)
        .send(res);
    }
  } catch (e) {
    logger.error('Error authorization request', e);

    return createResponse(500, false)
      .withLogger(logger)
      .send(res);
  }
}
