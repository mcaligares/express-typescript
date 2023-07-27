import { Router } from 'express';
import userRouter from './user.router';
import signinRouter from '../endpoints/signin/signin.router';

const router = Router();

router.use(userRouter);
router.use(signinRouter);

export default router;
