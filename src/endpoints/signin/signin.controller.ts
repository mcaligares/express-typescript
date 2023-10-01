import type { Response } from 'express';

import { createResponse } from '@/services/controller.service';
import { Logger } from '@/services/logger.service';
import { obfuscatePassword } from '@/utils/parse.utils';

import { signin } from './signin.service';
import type { SigninWithEmailRequest, SigninWithUsernameRequest } from './signin.types';

const logger = new Logger('SigninController');

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Signin
 *     description: Use email and password to signin.
*/
export async function signinWithEmail(payload: SigninWithEmailRequest, res: Response) {
  try {
    logger.info('signin with email', obfuscatePassword(payload));

    return await signinWithPayload(payload, res);
  } catch (e) {
    logger.info('error -----', e);
    logger.error('Error signin with email', payload, e);

    return createResponse(500, false)
      .withMessage('unexpected error')
      .withLogger(logger)
      .send(res);
  }
}

/**
 * @swagger
 * /signin/username:
 *   post:
 *     summary: Signin
 *     description: Use username and password to signin.
*/
export async function signinWithUsername(payload: SigninWithUsernameRequest, res: Response) {
  try {
    logger.info('signin with username', obfuscatePassword(payload));

    return await signinWithPayload(payload, res);
  } catch (e) {
    logger.error('Error signin with username', payload, e);

    return createResponse(500, false)
      .withMessage('unexpected error')
      .withLogger(logger)
      .send(res);
  }
}

async function signinWithPayload(payload: SigninWithEmailRequest | SigninWithUsernameRequest, res: Response) {
  const session = await signin(payload);

  if (!session) {
    logger.info('failed login', obfuscatePassword(payload));

    return createResponse(400, false)
      .withMessage('invalid email or password')
      .withLogger(logger)
      .send(res);
  }

  logger.info('successful login', obfuscatePassword(payload));

  return createResponse(200, true)
    .withMessage('user logged successfully')
    .withResult(session)
    .withLogger(logger)
    .send(res);
}