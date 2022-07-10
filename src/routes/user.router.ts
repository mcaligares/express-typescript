import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { validationMiddleware } from 'middlewares/validation.middleware';
import * as userController from 'controllers/user.controller';
import { UserSchema } from 'models/i-user';

const router = Router();

const userValidationHandler = (req: Request, res: Response, next: NextFunction) => validationMiddleware(req, res, next, UserSchema);

router.post('/user', userValidationHandler, (req: Request, res: Response) => userController.user(req.body, res));

router.get('/users', (req: Request, res: Response) => userController.users(res));

export default router;
