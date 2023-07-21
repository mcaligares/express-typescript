import Joi from 'joi';

export interface IUser {
  email: string
  name: string
  password: string
  needChangePassword: boolean
  confirmed: boolean
  enabled: boolean
}

export const UserSchema = Joi.object<IUser>({
  email: Joi.string().required(),
  name: Joi.string().min(3).optional(),
  password: Joi.string().required().min(6),
  needChangePassword: Joi.boolean().optional(),
});
