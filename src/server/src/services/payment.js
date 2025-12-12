import db from '../models/index.js';
import * as utils from '../utils/index.js';

export const handleZaloPayCallbackService = async (data, mac) => {
    try {
        if (!utils.verifyZaloPayCallback(data, mac)) {
            return { err: 1, msg: 'Invalid MAC' };
        }

        const parsedData = JSON.parse(data);
        const { app_trans_id, zp_trans_id, amount, status } = parsedData;

        if (status !== 1) return { err: 1, msg: 'Payment failed' };

        const transaction = await db.sequelize.transaction();
        try {
            const order = await db.Order.findOne({
                where: {
                    paymentMethod: 'ZaloPay',
                    paymentStatus: 'Pending',
                    'paymentGatewayData.app_trans_id': app_trans_id
                },
                transaction
            });

            if (!order || order.paymentGatewayData.app_trans_id !== app_trans_id) {
                await transaction.rollback();
                return { err: 1, msg: 'Order not found' };
            }

            if (Number(order.totalAmount) !== Number(amount)) {
                await transaction.rollback();
                return { err: 1, msg: 'Amount mismatch' };
            }

            const updatedGatewayData = {
                ...order.paymentGatewayData || {},
                zp_trans_id: zp_trans_id,
                callback_at: new Date(),
                callback_status: 'success'
            };

            await order.update({
                paymentGatewayData: updatedGatewayData,
                paymentTransactionId: zp_trans_id,
                paymentStatus: 'Paid', // Thanh toán thành công chờ xác nhận
                orderStatus: 'Processing'
            }, { transaction });

            const cart = await utils.getOrCreateCart(order.userId);
            const cartItems = await db.CartItem.findAll({
                where: { cartId: cart.id },
                include: [{ model: db.ProductVariant, as: 'productVariant' }],
                transaction
            });

            const stockUpdate = await utils.updateProductStock(cartItems, transaction);
            if (stockUpdate.err) {
                await transaction.rollback();
                return stockUpdate;
            }

            // Vì không có couponId trong model, giả sử mark coupon dựa trên logic khác hoặc bỏ nếu không cần
            // Nếu có appliedCoupon, cần lưu tạm trong paymentGatewayData khi create, ví dụ: paymentGatewayData.couponId = appliedCoupon.id
            // Giả sử đã lưu, thì:
            if (order.paymentGatewayData.couponId) {
                const userCoupon = await db.UserCoupon.findOne({
                    where: {
                        userId: order.userId,
                        couponId: order.paymentGatewayData.couponId,
                        status: 'unused',
                        usedAt: null
                    },
                    transaction
                });
                if (userCoupon) {
                    await utils.markUserCouponUsed(userCoupon, transaction);
                }
            }

            await db.CartItem.destroy({ where: { cartId: cart.id }, transaction });

            await transaction.commit();

            return { err: 0, msg: 'Success' };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        throw error;
    }
};