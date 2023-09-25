import type { NextFunction, Request, Response } from 'express';
import type { Schema } from 'joi';

import { logger } from '@/services/logger.service';

const defaultOptions = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true // remove unknown props
};

export function validationMiddleware(req: Request, res: Response, next: NextFunction, schema: Schema) {
  logger.debug('validating schema...');
  const { error, value } = schema.validate(req.body, defaultOptions);

  logger.debug('validation result:', error?.message || 'valid');
  if (error) {
    return res.status(400).send(error.details);
  } else {
    req.body = value;
    next();
  }
}
