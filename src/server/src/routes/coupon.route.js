import * as controller from '../controllers/coupon.controller.js';
import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { isAdmin } from '../middlewares/userAuthentication.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, controller.getAllCouponsController);
router.post('/', verifyToken, isAdmin, controller.createCouponController);
router.post('/auto-reward', controller.autoRewardCouponController);
router.post('/:couponId', verifyToken, isAdmin, controller.assignCouponManualController);
router.delete('/:couponId', verifyToken, isAdmin, controller.deleteCouponController);

export default router;