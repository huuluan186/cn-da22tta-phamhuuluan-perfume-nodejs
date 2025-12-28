import express from 'express';
import authRouter from './auth.route.js'
import userRouter from './user.route.js'
import locationRouter from './location.route.js'
import categoryRouter from './category.route.js';
import brandRouter from './brand.route.js';
import productRouter from './product.route.js'
import couponRouter from './coupon.route.js';
import contactRouter from './contact.route.js'
import adminRouter from './admin.route.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/locations', locationRouter);
router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/products', productRouter);
router.use('/coupons', couponRouter);
router.use('/contacts', contactRouter);
router.use('/admin', adminRouter);

export default router;