import Joi from 'joi';

type UserTokenType = 'confirmation-email' | 'change-password';

export type IUserToken = {
  type: UserTokenType
  userId: number
  token: string
  expiresIn: Date
};

export type IUserTokenWithID = IUserToken & { id: number };


export const UserTokenSchema = Joi.object<Pick<IUserToken, 'token'>>({
  token: Joi.string().uuid().required()
});
