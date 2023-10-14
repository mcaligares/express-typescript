import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { validationMiddleware } from '@/middlewares/validation.middleware';

import { signinWithEmail, signinWithUsername } from './signin.controller';
import { SigninEmailSchema, SigninUsernameSchema } from './signin.types';

/**
 * @swagger
 * tags:
 *   name: Signin
 *   description: Endpoints to authenticate to the application
 */

/**
 * @swagger
 * definitions:
 *  ValidData:
 *    description: Response with message and `ISession` as result object
 *    schema:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 *        result:
 *          type: object
 *          $ref: '#/definitions/ISession'
 *  InvalidData:
 *    description: Response with invalid data
 *    schema:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */

const router = Router();

const emailValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, SigninEmailSchema);

/**
 * @swagger
 * /signin:
 *  post:
 *    description: Authenticate with email to the application
 *    tags: [Signin]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/signin/email'
 *    responses:
 *      400:
 *        $ref: '#/definitions/InvalidData'
 *      200:
 *        $ref: '#/definitions/ValidData'
 */
router.post('/signin', emailValidationHandler, (req: Request, res: Response) => signinWithEmail(req.body, res));

const usernameValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, SigninUsernameSchema);

/**
 * @swagger
 * /signin/username:
 *  post:
 *    description: Authenticate with username to the application
 *    tags: [Signin]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/signin/username'
 *    responses:
 *      400:
 *        $ref: '#/definitions/InvalidData'
 *      200:
 *        $ref: '#/definitions/ValidData'
 */
router.post('/signin/username', usernameValidationHandler, (req: Request, res: Response) => signinWithUsername(req.body, res));

export default router;
