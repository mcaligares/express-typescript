import { Request, Response } from 'express'
import { getModelFromRequest, UserModel, UserValidationSchema } from '../models/user.model'
import UserService from '../services/user.service'
import { AlreadyExistException } from '../utils/model.exceptions'
import { BaseController } from './base.controller'

export default class UserController extends BaseController {

  constructor(private service: UserService = new UserService()) {
    super()
    this.router.get('/user', this.list.bind(this))
    this.router.put('/user', this.schema(UserValidationSchema), this.validate, this.create.bind(this))
  }

  async create(request: Request|any, response: Response|any) {
    try {
      const user = await this.service.create(getModelFromRequest(request))
      response.json(user)
    } catch (error) {
      if (error instanceof AlreadyExistException) {
        response.status(error.code).send({ errors: [error] })
      } else {
        response.status(this.CODE_INTERNAL_SERVER_ERROR).send({ errors: [error] })
      }
    }
  }

  async list(request: Request|any, response: Response|any) {
    try {
      const users = await this.service.findAllBy(UserModel)
      response.json(users)
    } catch (error) {
      response.status(this.CODE_INTERNAL_SERVER_ERROR).send({ errors: [error] })
    }
  }

}
