/**
 * @swagger
 * definitions:
 *  IUser:
 *    properties:
 *      id:
 *        type: number
 *      email:
 *        type: string
 *      username:
 *        type: string
 *      password:
 *        type: string
 *      needChangePassword:
 *        type: boolean
 *      confirmed:
 *        type: boolean
 *      enabled:
 *        type: boolean
 */

export interface IUser {
  email: string
  username: string
  password: string
  needChangePassword: boolean
  confirmed: boolean
  enabled: boolean
}

export interface IUserWithID extends IUser {
  id: number
}
