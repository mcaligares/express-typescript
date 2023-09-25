import { Router } from 'express';

import signinRouter from '@/endpoints/signin/signin.router';
import userRouter from '@/endpoints/user/user.router';

const router = Router();

router.use(userRouter);
router.use(signinRouter);

export default router;
