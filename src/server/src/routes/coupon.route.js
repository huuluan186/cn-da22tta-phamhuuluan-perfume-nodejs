import * as controller from '../controllers/coupon.controller.js';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /coupons/auto-reward:
 *   post:
 *     tags: [Coupons]
 *     summary: Tự động gán coupon cho user dựa trên tổng giá trị đơn hàng
 *     description: Endpoint để hệ thống tự động gán coupon cho người dùng khi đạt điều kiện (ví dụ sau khi hoàn thành đơn hàng).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - totalOrderValue
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user_123
 *               totalOrderValue:
 *                 type: number
 *                 example: 5000000
 *                 description: Tổng giá trị đơn hàng để tính toán coupon phù hợp
 *     responses:
 *       200:
 *         description: Gán coupon thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Coupon assigned successfully
 *       400:
 *         description: Không đủ điều kiện nhận coupon hoặc dữ liệu không hợp lệ
 */
router.post('/auto-reward', controller.autoRewardCouponController);

export default router;