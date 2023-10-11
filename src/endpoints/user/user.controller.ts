import type { Response } from 'express';

import type { IUser, IUserWithID } from '@/models/i-user';
import { createResponse } from '@/services/controller.service';
import { Logger } from '@/services/logger.service';
import { obfuscatePassword } from '@/utils/parse.utils';

import * as service from './user.service';
import type { IChangePasswordUserToken, IConfirmationUserToken } from './user.types';

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

    const result = await service.withTransaction(async (transaction) => {
      const newUser = await service.createUser(user, transaction);

      await service.createToken({ user: newUser, type: 'confirmation-email', transaction });

      if (newUser.needChangePassword) {
        await service.createToken({ user: newUser, type: 'change-password', transaction });
      }

      return { user: newUser };
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
 * /user/confirm:
 *   post:
 *     summary: confirm user account
 *     description: confirm user account
*/
export async function confirm({ token }: IConfirmationUserToken, res: Response) {
  try {
    logger.info('confirmating user token', token);

    const result = await service.confirmUserAccount(token);

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
 * /user/password:
 *   post:
 *     summary: change the user password
 *     description: change the user password using a change-password-token as authenticator
*/
export async function setPassword(params: IChangePasswordUserToken, res: Response) {
  try {
    logger.info('change password user token', params.token);

    const result = await service.setUserPassword(params);

    if (!result) {
      return createResponse(403, false)
        .withMessage('invalid user token')
        .withLogger(logger)
        .send(res);
    }

    return createResponse(200, true)
      .withMessage('user password updated successfully')
      .withLogger(logger)
      .send(res);
  } catch (e) {
    logger.error('Error setting user password', params.token, e);

    return createResponse(500, false)
      .withMessage('Error setting user password')
      .withLogger(logger)
      .send(res);
  }
}

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users
 *     description: Get all user by filter.
*/
export async function users(params: Partial<IUser>, res: Response) {
  try {
    logger.info('getting users');
    const users = await service.getAllUsers(params);

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

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Update an user
 *     description: Update user property (username or email).
*/
export async function update(user: IUserWithID, res: Response) {
  try {
    logger.info('updating user', user);

    const updatedUser = await service.updateUser(user);

    logger.info('updated user', updatedUser);

    return createResponse(200, true)
      .withMessage('user updated successfully')
      .withResult(updatedUser)
      .withLogger(logger)
      .send(res);
  } catch (e) {
    logger.error('Error updating user', user, e);

    return createResponse(500, false)
      .withMessage('Error updating user')
      .withLogger(logger)
      .send(res);
  }
}

/**
 * @swagger
 * /user/enable:
 *   post:
 *     summary: Enable user
*/
export async function enable(userIdParam: string, res: Response) {
  return enableUser(userIdParam, true, res);
}

/**
 * @swagger
 * /user/disable:
 *   post:
 *     summary: Disable user
*/
export async function disable(userIdParam: string, res: Response) {
  return enableUser(userIdParam, false, res);
}

async function enableUser(userIdParam: string, enable: boolean, res: Response) {
  try {
    logger.info('enabling user', userIdParam, enable);

    const updatedUser = await service.enableUser(userIdParam, enable);

    logger.info('enabling user', updatedUser);

    return createResponse(200, true)
      .withMessage('user updated successfully')
      .withResult(updatedUser)
      .withLogger(logger)
      .send(res);
  } catch (e) {
    logger.error('Error enabling user', user, e);

    return createResponse(500, false)
      .withMessage('Error enabling user')
      .withLogger(logger)
      .send(res);
  }
}

/**
 * @swagger
 * /user/:userId:
 *   delete:
 *     summary: Delete a user
 *     description: Delete user and  userToken associated.
*/
export async function _delete(userIdParam: string, res: Response) {
  try {
    logger.info('deleting user', userIdParam);
    await service.deleteUser(userIdParam);

    return createResponse(200, true)
      .withMessage('user deleted successfully')
      .withResult(users)
      .withLogger(logger)
      .send(res);
  } catch (e) {
    logger.error('Error deleting user', e);

    return createResponse(500, false)
      .withMessage('Error deleting user')
      .withLogger(logger)
      .send(res);
  }
}
