import express from 'express';
import { currentUserRouter } from './current-user';
import { signinRouter } from './signin';
import { signupRouter } from './signup';

const router = express.Router({ mergeParams: true });

router.use(signinRouter);
router.use(signupRouter);
router.use(currentUserRouter);

export { router as userRouter };
