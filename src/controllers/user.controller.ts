import type { Response } from 'express';
import { createUser, getAllUsers } from 'repositories/user.repository';
import { Logger } from 'services/logger.service';
import type { IUser } from '../models/i-user';

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
    const newUser = createUser(user);

    return res.status(200).send({
      message: 'User created',
      success: 'ok',
      user: newUser
    });
  } catch (e) {
    logger.error('Error creating user', e);

    return res.status(500).send({
      message: 'Error creating user'
    });
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

    return res.status(200).send({
      success: 'ok',
      users,
    });
  } catch (e) {
    logger.error('Error getting all users', e);

    return res.status(500).send({
      message: 'Error getting all users',
    });
  }
}
