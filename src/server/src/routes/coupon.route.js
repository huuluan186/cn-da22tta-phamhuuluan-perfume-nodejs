import * as controller from '../controllers/coupon.controller.js';
import express from 'express';

const router = express.Router();

router.post('/auto-reward', controller.autoRewardCouponController);

export default router;