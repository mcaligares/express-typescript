import Joi from 'joi';

type UserTokenType = 'confirmation-email' | 'change-password';

export type IUserToken = {
  type: UserTokenType
  userId: number
  token: string
  expiresIn: Date
};

export type IUserTokenWithID = IUserToken & { id: number };

export type IConfirmationUserToken = Pick<IUserToken, 'token'>;

export type IChangePasswordUserToken = Pick<IUserToken, 'token'> & { password: string };

export const ConfirmationUserTokenSchema = Joi.object<IConfirmationUserToken>({
  token: Joi.string().uuid().required()
});

export const ChangePasswordUserTokenSchema = Joi.object<IChangePasswordUserToken>({
  token: Joi.string().uuid().required(),
  password: Joi.string().required().min(6),
});
