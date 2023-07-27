import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { validationMiddleware } from 'middlewares/validation.middleware';
import { siginWithEmail, siginWithUsername } from './signin.controller';
import { SigninEmailSchema, SigninUsernameSchema } from './signin.types';

const router = Router();

const emailValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, SigninEmailSchema);

const usernameValidationHandler = (req: Request, res: Response, next: NextFunction) =>
  validationMiddleware(req, res, next, SigninUsernameSchema);

router.post('/signin', emailValidationHandler, (req: Request, res: Response) => siginWithEmail(req.body, res));
router.post('/signin/username', usernameValidationHandler, (req: Request, res: Response) => siginWithUsername(req.body, res));

export default router;
