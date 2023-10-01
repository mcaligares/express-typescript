import type { NextFunction, Request, Response } from 'express';
import type { Schema } from 'joi';

import { createResponse } from '@/services/controller.service';
import { Logger } from '@/services/logger.service';

const DEFAULT_OPTIONS = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true // remove unknown props
};

const logger = new Logger('ValidationMiddleware');

export function validationMiddleware(req: Request, res: Response, next: NextFunction, schema: Schema) {
  try {
    logger.debug('validating request...');
    const { error, value } = schema.validate(req.body, DEFAULT_OPTIONS);

    if (error) {
      return createResponse(400, false)
        .withLogger(logger)
        .withResult(error.details)
        .send(res);
    } else {
      logger.debug('request validated');
      req.body = value;
      next();
    }
  } catch (e) {
    logger.error('Error validating request', e);

    return createResponse(403, false)
      .withLogger(logger)
      .send(res);
  }
}
