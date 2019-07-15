import { NextFunction, Request, Response } from 'express'
import { getModelFromRequest, UserModel, UserValidationSchema } from '../models/user.model'
import UserService from '../services/user.service'
import { BaseController } from './base.controller'

export default class UserController extends BaseController {

  constructor(private service: UserService = new UserService()) {
    super()
    this.router.get('/user', this.list.bind(this))
    this.router.put('/user', this.schema(UserValidationSchema), this.validate, this.create.bind(this))
    this.router.post('/login', this.schema(UserValidationSchema), this.validate, this.login.bind(this))
  }

  async login(request: Request|any, response: Response|any, next: NextFunction) {
    try {
      const model = getModelFromRequest(request)
      const user = await this.service.findyByUsernameAndPassword(model.username, model.password)
      response.json(user)
    } catch (error) {
      return next(error)
    }
  }

  async create(request: Request|any, response: Response|any, next: NextFunction) {
    try {
      const user = await this.service.create(getModelFromRequest(request))
      response.json(user)
    } catch (error) {
      return next(error)
    }
  }

  async list(request: Request|any, response: Response|any, next: NextFunction) {
    try {
      const users = await this.service.findAllBy(UserModel)
      response.json(users)
    } catch (error) {
      return next(error)
    }
  }

}
