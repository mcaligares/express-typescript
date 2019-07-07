import { NextFunction, Request, Response, Router } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import UserModel from '../models/user.model'

export class UserController {

  router: Router;

  constructor() {
    this.router = Router()
    this.router.post('/user', checkSchema(UserModel.schema), this.create)
  }

  private create(request: Request, response: Response, next: NextFunction) {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).json(result)
    } else {
      response.status(200).end()
    }
  }

}

const UserRouter = new UserController().router
export default UserRouter
