import express from 'express';
import authRouter from './auth.route.js'
import userRouter from './user.route.js'
import regionRouter from './region.route.js'
import categoryRouter from './category.route.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/', regionRouter)
router.use('/categories', categoryRouter);

export default router;