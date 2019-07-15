import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ErrorException } from '../utils/model.exceptions'

const errorHandlerMiddleware: ErrorRequestHandler =
(error: Error, request: Request, response: Response, next: NextFunction) => {

  if (error instanceof ErrorException) return response.status(error.code).json({ errors: [error] }).end()

  return response.status(500).json({ errors: [error] }).end()

}

export default errorHandlerMiddleware
