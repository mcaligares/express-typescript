import Joi from 'joi';

export interface IUser {
  email: string
  name: string
}

export const UserSchema = Joi.object<IUser>({
  email: Joi.string().required(),
  name: Joi.string().min(3).optional()
});
