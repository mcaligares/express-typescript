import { NextFunction, Request, Response, Router } from 'express'
import { checkSchema, validationResult } from 'express-validator'

export class BaseController {
  protected readonly CODE_UNPROCESSABLE_ENTITY: number = 422
  protected readonly CODE_INTERNAL_SERVER_ERROR: number = 500

  constructor(public router: Router = Router()) {
    this.validate = this.validate.bind(this)
  }

  protected schema(schema: any) {
    return checkSchema(schema)
  }

  protected validate(request: Request, response: Response, next: NextFunction) {
    const result = validationResult(request)
    if (result.isEmpty()) return next()
    response.status(this.CODE_UNPROCESSABLE_ENTITY).send(result)
  }

}
