import express from 'express';
import authRouter from './auth.route.js'
import userRouter from './user.route.js'
import regionRouter from './region.route.js'
import categoryRouter from './category.route.js';
import brandRouter from './brand.route.js';
import productRouter from './product.route.js'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/', regionRouter)
router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/products', productRouter);

export default router;