import Joi from 'joi';

export type SigninWithEmailRequest = {
  email: string,
  password: string
}

export type SigninWithUsernameRequest = {
  username: string
  password: string
}

export const SigninEmailSchema = Joi.object<SigninWithEmailRequest>({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const SigninUsernameSchema = Joi.object<SigninWithUsernameRequest>({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
