import Joi from 'joi';

export interface IUser {
  email: string
  username: string
  password: string
  needChangePassword: boolean
  confirmed: boolean
  enabled: boolean
}

export const UserSchema = Joi.object<IUser>({
  email: Joi.string().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().required().min(6),
  needChangePassword: Joi.boolean().optional(),
});
