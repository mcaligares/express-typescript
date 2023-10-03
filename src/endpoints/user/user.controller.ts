import type { Response } from 'express';

import type { IUser } from '@/models/i-user';
import { createResponse } from '@/services/controller.service';
import { Logger } from '@/services/logger.service';
import { obfuscatePassword } from '@/utils/parse.utils';

import { confirmUserAccount, createConfirmationToken, createUser, getAllUsers, withTransaction } from './user.service';
import type { UserTransactionResult } from './user.types';

const logger = new Logger('UserController');

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new User entity previusly validated. Can be used to populate a list of fake users when prototyping or testing an API.
*/
export async function user(user: IUser, res: Response) {
  try {
    logger.info('creating new user', obfuscatePassword(user));

    const result = await withTransaction(async (transaction) => {
      const newUser = await createUser(user, transaction);
      const userToken = await createConfirmationToken(newUser, transaction);

      return { user: newUser, userToken } as UserTransactionResult;
    });

    logger.info('created user and token in transaction', result);

    return createResponse(200, true)
      .withMessage('user created successfully')
      .withResult(result.user)
      .withLogger(logger)
      .send(res);
  } catch (e) {
    logger.error('Error creating user', user, e);

    return createResponse(500, false)
      .withMessage('Error creating user')
      .withLogger(logger)
      .send(res);
  }
}


/**
 * @swagger
 * /confirm:
 *   post:
 *     summary: confirm user account
 *     description: confirm user account
*/
export async function confirm(token: string, res: Response) {
  try {
    logger.info('confirmating user token', token);

    const result = await confirmUserAccount(token);

    if (!result) {
      return createResponse(403, false)
        .withMessage('invalid user token')
        .withLogger(logger)
        .send(res);
    }

    return createResponse(200, true)
      .withMessage('user confirmed successfully')
      .withLogger(logger)
      .send(res);
  } catch (e) {
    logger.error('Error confirming user token', token, e);

    return createResponse(500, false)
      .withMessage('Error confirming user token')
      .withLogger(logger)
      .send(res);
  }
}

/**
 * @swagger
 * /users:
 *   get:
 *     summary: get all users
 *     description: Retrieve a list of users.
*/
export async function users(res: Response) {
  try {
    logger.info('getting users');
    const users = await getAllUsers();

    return createResponse(200, true)
      .withMessage('users obtained successfully')
      .withResult(users)
      .withLogger(logger)
      .send(res);
  } catch (e) {
    logger.error('Error getting all users', e);

    return createResponse(500, false)
      .withMessage('Error getting all users')
      .withLogger(logger)
      .send(res);
  }
}
