import type { Response } from 'express';
import type { IUser } from '../models/i-user';
import type { ControllerResponse, } from 'models/i-response';
import { Logger } from 'services/logger.service';
import { createUser, getAllUsers } from 'repositories/user.repository';

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
    const newUser = await createUser(user);
    const response: ControllerResponse<IUser> = {
      ok: true,
      message: 'User created',
      result: newUser,
    };

    return res.status(200).send(response);
  } catch (e) {
    logger.error('Error creating user', e);
    const response: ControllerResponse<never> = {
      ok: false,
      message: 'Error creating user',
    };

    return res.status(500).send(response);
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
    const repsonse: ControllerResponse<IUser[]> = {
      ok: true,
      message: 'User listed',
      result: users,
    };

    return res.status(200).send(repsonse);
  } catch (e) {
    logger.error('Error getting all users', e);
    const response: ControllerResponse<never> = {
      ok: false,
      message: 'Error getting all users',
    };

    return res.status(500).send(response);
  }
}
