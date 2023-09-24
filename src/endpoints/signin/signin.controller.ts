import type { Response } from 'express';
import type { SigninWithEmailRequest, SigninWithUsernameRequest } from './signin.types';
import { signin } from './signin.service';
import { Logger } from 'services/logger.service';
import { createResponse } from 'services/controller.service';

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
    logger.info('signin with payload', payload.email);

    const session = await signin(payload);

    if (!session) {
      logger.info('signin failed', payload.email);

      return createResponse(400, false)
        .withMessage('User not found')
        .send(res);
    }

    logger.info('signin done', payload.email);

    return createResponse(200, true)
      .withMessage('signin successfully')
      .withResult(session)
      .send(res);
  } catch (e) {
    logger.error('Error signin', e);

    return createResponse(500, false).withMessage('Error signin').send(res);
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
    logger.info('signin with payload', payload.username);

    const session = await signin(payload);

    if (!session) {
      logger.info('signin failed', payload.username);

      return createResponse(400, false)
        .withMessage('User not found')
        .send(res);
    }

    logger.info('signin done', payload.username);

    return createResponse(200, true)
      .withMessage('User signin successfully')
      .withResult(session)
      .send(res);
  } catch (e) {
    logger.error('signin error', e);

    return createResponse(500, false).withMessage('Error signin').send(res);
  }
}
