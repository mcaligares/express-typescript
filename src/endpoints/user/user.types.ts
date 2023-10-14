import Joi from 'joi';

import type { IUser, IUserWithID } from '@/models/i-user';
import type { IUserToken } from '@/models/i-user-token';

/**
 * @swagger
 * parameters:
 *  user:
 *    create:
 *      name: data
 *      description: User to create as JSON object
 *      in: body
 *      required: true
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        password:
 *          type: string
 *        needChangePassword:
 *          type: boolean
 */
export const UserSchema = Joi.object<IUser>({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().required().min(6),
  needChangePassword: Joi.boolean().optional(),
});

/**
 * @swagger
 * parameters:
 *  user:
 *    update:
 *      name: data
 *      description: User to update as JSON object
 *      in: body
 *      required: true
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        email:
 *          type: string
 *        username:
 *          type: string
 */
export const UpdateUserSchema = Joi.object<Pick<IUserWithID, 'id' | 'email' | 'username'>>({
  id: Joi.number().required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
});

/**
 * @swagger
 * parameters:
 *  user:
 *    filter:
 *      name: data
 *      description: User filter as JSON object
 *      in: body
 *      required: false
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        enabled:
 *          type: boolean
 *        confirmed:
 *          type: boolean
 */
export type IUserFilter = Partial<Omit<IUser, 'password' | 'needChangePassword'>>;

/**
 * @swagger
 * parameters:
 *  user:
 *    confirm:
 *      name: data
 *      description: User confirmation token inner a JSON object
 *      in: body
 *      required: true
 *      type: object
 *      properties:
 *        token:
 *          type: string
 */
export type IConfirmationUserToken = Pick<IUserToken, 'token'>;

export const ConfirmationUserTokenSchema = Joi.object<IConfirmationUserToken>({
  token: Joi.string().uuid().required()
});

/**
 * @swagger
 * parameters:
 *  user:
 *    password:
 *      name: data
 *      description: User change password token inner a JSON object
 *      in: body
 *      required: true
 *      type: object
 *      properties:
 *        token:
 *          type: string
 *        password:
 *          type: string
 */
export type IChangePasswordUserToken = Pick<IUserToken, 'token'> & { password: string };

export const ChangePasswordUserTokenSchema = Joi.object<IChangePasswordUserToken>({
  token: Joi.string().uuid().required(),
  password: Joi.string().required().min(6),
});

export type IUserIdAndEnable = { id: number; enable: boolean };
