import { ValidationSchema } from 'express-validator'

export default class UserModel {
  username: string
  password: string

  static get schema(): ValidationSchema {
    return {
      username: {
        in: 'body',
        isEmail: true,
        normalizeEmail: true,
      },
      password: {
        in: 'body',
        isLength: {
          options: { min: 6, max: 12 },
        },
      },
    }
  }

}
