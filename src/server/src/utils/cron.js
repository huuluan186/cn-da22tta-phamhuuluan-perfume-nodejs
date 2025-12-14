import cron from 'node-cron';
import { Op } from 'sequelize';
import db from '../models/index.js';
/**
 * Chạy mỗi ngày lúc 0h
 * Sẽ tìm tất cả coupon đã hết hạn nhưng vẫn đang unused
 * và cập nhật status thành expired
 */
export const autoExpireCoupons = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const now = new Date();

            const expiredCoupons = await db.UserCoupon.findAll({
                where: {
                    status: 'unused',
                    validUntil: {
                        [Op.lt]: now
                    }
                }
            });

            if (!expiredCoupons.length) return;

            for (let userCoupon of expiredCoupons) {
                await userCoupon.update({
                    status: 'expired'
                });
            }

            console.log(`✅ Auto expired ${expiredCoupons.length} coupons`);
        } catch (error) {
            console.error("❌ Auto expire coupon error:", error);
        }
    });
};

/**
 * Hủy các đơn ZaloPay đã quá hạn (expiresAt < now)
 * Chuyển trạng thái đơn thành Cancelled và paymentStatus thành Failed
 * Chạy mỗi 10 phút
 */

export const cancelExpiredOrders = () => {
    cron.schedule('*/15 * * * *', async () => { 
        try {
            const result = await db.Order.update(
                {
                    orderStatus: 'Cancelled',
                    paymentStatus: 'Failed'
                },
                {
                    where: {
                        paymentMethod: 'ZaloPay',
                        paymentStatus: 'Pending',
                        expiresAt: {
                            [Op.lt]: new Date()
                        }
                    }
                }
            );

            if (result[0] > 0) {
                console.log(`Đã tự động hủy ${result[0]} đơn ZaloPay quá hạn`);
            }
        } catch (error) {
            console.error("Cron cancelExpiredOrders error:", error);
        }
    });
};