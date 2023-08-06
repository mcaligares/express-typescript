import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { IRequest } from 'models/i-request';
import { UserSchema } from 'models/i-user';
import { authMiddleware } from 'middlewares/auth.middleware';
import { validationMiddleware } from 'middlewares/validation.middleware';
import * as userController from './user.controller';

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
  (req: Request, res: Response) => userController.users(res)
);

export default router;
