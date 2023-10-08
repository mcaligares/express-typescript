import Joi from 'joi';

import type { IUser, IUserWithID } from '@/models/i-user';
import type { IUserToken } from '@/models/i-user-token';

export const UserSchema = Joi.object<IUser>({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().required().min(6),
  needChangePassword: Joi.boolean().optional(),
});

export const UpdateUserSchema = Joi.object<Pick<IUserWithID, 'id' | 'email' | 'username'>>({
  id: Joi.number().required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
});

export type IConfirmationUserToken = Pick<IUserToken, 'token'>;

export type IChangePasswordUserToken = Pick<IUserToken, 'token'> & { password: string };

export const ConfirmationUserTokenSchema = Joi.object<IConfirmationUserToken>({
  token: Joi.string().uuid().required()
});

export const ChangePasswordUserTokenSchema = Joi.object<IChangePasswordUserToken>({
  token: Joi.string().uuid().required(),
  password: Joi.string().required().min(6),
});

export type IUserIdAndEnable = { id: number; enable: boolean };
