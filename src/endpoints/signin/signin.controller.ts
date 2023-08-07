import type { Response } from 'express';
import type { ISession } from 'models/i-session';
import type { IResponse } from 'models/i-response';
import type { SigninWithEmailRequest, SigninWithUsernameRequest } from './signin.types';
import { signin } from './signin.service';
import { Logger } from 'services/logger.service';

const logger = new Logger('SigninController');

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Signin
 *     description: Use email and password to signin.
*/
export async function siginWithEmail(payload: SigninWithEmailRequest, res: Response) {
  try {
    logger.info('signin with payload', payload);

    const sesion = await signin(payload);

    if (sesion) {
      const response: IResponse<ISession> = {
        ok: true,
        message: 'User signin successfully',
        result: sesion,
      };

      return res.status(200).send(response);
    }

    const response: IResponse<never> = { ok: false, message: 'User not found' };

    return res.status(400).send(response);
  } catch (e) {
    logger.error('Error signin', e);
    const response: IResponse<never> = { ok: false, message: 'Error signin' };

    return res.status(500).send(response);
  }
}

/**
 * @swagger
 * /signin/username:
 *   post:
 *     summary: Signin
 *     description: Use username and password to signin.
*/
export async function siginWithUsername(payload: SigninWithUsernameRequest, res: Response) {
  try {
    logger.info('signin with payload', payload);

    const session = await signin(payload);
    const response: IResponse<ISession> = {
      ok: true,
      message: 'User signin successfully',
      result: session,
    };

    return res.status(200).send(response);
  } catch (e) {
    logger.error('Error signin', e);
    const response: IResponse<never> = { ok: false, message: 'Error signin' };

    return res.status(500).send(response);
  }
}
