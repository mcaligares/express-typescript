import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { authenticationMiddleware } from '@/middlewares/authentication.middleware';
import { authorizationMiddleware } from '@/middlewares/authorization.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import type { IRequest } from '@/models/i-request';
import type { AuthRouteKey } from '@/routes/authorization.route';

import * as userController from './user.controller';
import { ChangePasswordUserTokenSchema, ConfirmationUserTokenSchema, UpdateUserSchema, UserSchema } from './user.types';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints for working with users in the application
 */

/**
 * @swagger
 * definitions:
 *  response:
 *    user:
 *      description: Response with message and `IUser` as result object
 *      schema:
 *        type: object
 *        properties:
 *          ok:
 *            type: boolean
 *          message:
 *            type: string
 *          result:
 *            type: object
 *            $ref: '#/definitions/IUser'
 *    users:
 *      description: Response with message and Array of `IUser` as result object
 *      schema:
 *        type: object
 *        properties:
 *          ok:
 *            type: boolean
 *          message:
 *            type: string
 *          result:
 *            type: array
 *            items:
 *              type: object
 *              $ref: '#/definitions/IUser'
 */

/**
 * @swagger
 * parameters:
 *  userId:
 *    name: userId
 *    description: User id to enable/disable in query path
 *    in: path
 *    required: true
 *    schema:
 *      type: number
 */
const router = Router();

const authenticateRequest = (req: Request, res: Response, next: NextFunction) =>
  authenticationMiddleware(req as IRequest, res, next);

const authorizeRequest = (req: Request, res: Response, next: NextFunction, path: AuthRouteKey) =>
  authorizationMiddleware(req as IRequest, res, next, path);

/**
 * @swagger
 * /user:
 *  post:
 *    description: Create a new user in the application
 *    tags: [User]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/user/create'
 *    responses:
 *      400:
 *        $ref: '#/definitions/response/invalid'
 *      200:
 *        $ref: '#/definitions/response/user'
 */

const userValidationRequest = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, UserSchema);

router.post(
  '/user',
  userValidationRequest,
  authenticateRequest,
  (req: Request, res: Response, next: NextFunction) => authorizeRequest(req, res, next, 'user-create'),
  (req: Request, res: Response) => userController.user(req.body, res)
);

/**
 * @swagger
 * /users:
 *  get:
 *    description: Get all users in the application
 *    tags: [User]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/user/filter'
 *    responses:
 *      200:
 *        $ref: '#/definitions/response/users'
 */
router.get(
  '/users',
  authenticateRequest,
  (req: Request, res: Response) => userController.users(req.body, res)
);

/**
 * @swagger
 * /user/confirm:
 *  post:
 *    description: Confirm user account using a token as authentication method
 *    tags: [User]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/user/confirm'
 *    responses:
 *      400:
 *        $ref: '#/definitions/response/invalid'
 *      200:
 *        $ref: '#/definitions/response/empty'
 */
const confirmationUserTokenValidationRequest = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, ConfirmationUserTokenSchema);

router.post(
  '/user/confirm',
  confirmationUserTokenValidationRequest,
  (req: Request, res: Response) => userController.confirm(req.body, res)
);

/**
 * @swagger
 * /user/password:
 *  post:
 *    description: Set the user password using a token as authentication method.
 *    tags: [User]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/user/password'
 *    responses:
 *      400:
 *        $ref: '#/definitions/response/invalid'
 *      200:
 *        $ref: '#/definitions/response/empty'
 */
const changePasswordUserTokenValidationRequest = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, ChangePasswordUserTokenSchema);

router.post(
  '/user/password',
  changePasswordUserTokenValidationRequest,
  (req: Request, res: Response) => userController.setPassword(req.body, res)
);

/**
 * @swagger
 * /user/{userId}:
 *  delete:
 *    description: Delete an user account in the application
 *    tags: [User]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/user/userId'
 *    responses:
 *      400:
 *        $ref: '#/definitions/response/invalid'
 *      200:
 *        $ref: '#/definitions/response/empty'
 */
router.delete(
  '/user/:userId',
  authenticateRequest,
  (req: Request, res: Response, next: NextFunction) => authorizeRequest(req, res, next, 'user-delete'),
  (req: Request, res: Response) => userController._delete(req.params.userId, res)
);

/**
 * @swagger
 * /user:
 *  patch:
 *    description: Update an user in the application
 *    tags: [User]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/user/update'
 *    responses:
 *      400:
 *        $ref: '#/definitions/response/invalid'
 *      200:
 *        $ref: '#/definitions/response/user'
 */
const updateUserValidationRequest = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, UpdateUserSchema);

router.patch(
  '/user',
  authenticateRequest,
  updateUserValidationRequest,
  (req: Request, res: Response, next: NextFunction) => authorizeRequest(req, res, next, 'user-update'),
  (req: Request, res: Response) => userController.update(req.body, res)
);

/**
 * @swagger
 * /user/enable/{userId}:
 *  post:
 *    description: Enable an user account in the application
 *    tags: [User]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/user/userId'
 *    responses:
 *      400:
 *        $ref: '#/definitions/response/invalid'
 *      200:
 *        $ref: '#/definitions/response/empty'
 */
router.post(
  '/user/enable/:userId',
  authenticateRequest,
  (req: Request, res: Response, next: NextFunction) => authorizeRequest(req, res, next, 'user-enable'),
  (req: Request, res: Response) => userController.enable(req.params.userId, res)
);

/**
 * @swagger
 * /user/disable/{userId}:
 *  post:
 *    description: Disable an user account in the application
 *    tags: [User]
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/user/userId'
 *    responses:
 *      400:
 *        $ref: '#/definitions/response/invalid'
 *      200:
 *        $ref: '#/definitions/response/empty'
 */
router.post(
  '/user/disable/:userId',
  authenticateRequest,
  (req: Request, res: Response, next: NextFunction) => authorizeRequest(req, res, next, 'user-enable'),
  (req: Request, res: Response) => userController.disable(req.params.userId, res)
);

export default router;
