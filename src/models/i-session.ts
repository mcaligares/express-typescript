import type { IUserWithID } from '@/models/i-user';

/**
 * @swagger
 * definitions:
 *  ISession:
 *    properties:
 *      user:
 *        type: object
 *        $ref: '#/definitions/IUser'
 *      accessToken:
 *        type: string
 */
export type ISession = {
  user: IUserWithID
  accessToken: string
}
