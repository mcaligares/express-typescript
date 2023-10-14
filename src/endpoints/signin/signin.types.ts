import Joi from 'joi';

/**
 * @swagger
 * parameters:
 *  signin:
 *    email:
 *      name: signin with email
 *      description: Email and password as JSON object
 *      in: body
 *      required: true
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 */
export type SigninWithEmailRequest = {
  email: string,
  password: string
}

/**
 * @swagger
 * parameters:
 *  signin:
 *    username:
 *      name: signin with username
 *      description: Username and password as JSON object
 *      in: body
 *      required: true
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *        password:
 *          type: string
 */
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
