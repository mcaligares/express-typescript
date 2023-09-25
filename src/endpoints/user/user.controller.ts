import type { Response } from 'express';

import type { IUser } from '@/models/i-user';
import { createResponse } from '@/services/controller.service';
import { Logger } from '@/services/logger.service';

import { createNewUser, getAllUsers } from './user.service';

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
    logger.info('create new user');
    const newUser = await createNewUser(user);

    return createResponse(200, true)
      .withMessage('User created')
      .withResult(newUser)
      .send(res);
  } catch (e) {
    logger.error('Error creating user', e);

    return createResponse(500, false).withMessage('Error creating user').send(res);
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
    const users = await getAllUsers();

    return createResponse(200, true)
      .withMessage('User listed')
      .withResult(users)
      .send(res);
  } catch (e) {
    logger.error('Error getting all users', e);

    return createResponse(500, false).withMessage('Error getting all users').send(res);
  }
}
