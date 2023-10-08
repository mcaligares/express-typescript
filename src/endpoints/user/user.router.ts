import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import type { IRequest } from '@/models/i-request';

import * as userController from './user.controller';
import { ChangePasswordUserTokenSchema, ConfirmationUserTokenSchema, UpdateUserSchema, UserSchema } from './user.types';

const router = Router();

const authValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req as IRequest, res, next);

const userValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, UserSchema);

router.post(
  '/user',
  userValidationHandler,
  authValidationHandler,
  (req: Request, res: Response) => userController.user(req.body, res)
);

router.get(
  '/users',
  authValidationHandler,
  (req: Request, res: Response) => userController.users(req.body, res)
);

const confirmationUserTokenValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, ConfirmationUserTokenSchema);

router.post(
  '/user/confirm',
  confirmationUserTokenValidationHandler,
  (req: Request, res: Response) => userController.confirm(req.body, res)
);

const changePasswordUserTokenValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, ChangePasswordUserTokenSchema);

router.post(
  '/user/password',
  changePasswordUserTokenValidationHandler,
  (req: Request, res: Response) => userController.setPassword(req.body, res)
);

router.delete(
  '/user/:userId',
  authValidationHandler,
  (req: Request, res: Response) => userController._delete(req.params.userId, res)
);

const updateUserValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, UpdateUserSchema);

router.patch(
  '/user',
  authValidationHandler,
  updateUserValidationHandler,
  (req: Request, res: Response) => userController.update(req.body, res)
);

router.post(
  '/user/enable/:userId',
  authValidationHandler,
  (req: Request, res: Response) => userController.enable(req.params.userId, res)
);

router.post(
  '/user/disable/:userId',
  authValidationHandler,
  (req: Request, res: Response) => userController.disable(req.params.userId, res)
);

export default router;
