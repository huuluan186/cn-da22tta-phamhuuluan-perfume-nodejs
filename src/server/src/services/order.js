import db from '../models/index.js';
import * as utils from '../utils/index.js';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { createZaloPayOrder, formatPaginatedResponse,getPagination, orderIncludes } from '../utils/index.js';

// Tạo đơn hàng từ giỏ hàng
export const createOrderService = async (userId, addressId, couponCode, paymentMethod = "COD") => {
    const transaction = await db.sequelize.transaction();
    try {
        // 1. check địa chỉ
        const checkAddress = await utils.checkUserAddress(userId, addressId, transaction);
        if (checkAddress.err) { // không hợp lệ
            await transaction.rollback();
            return checkAddress;
        }

        // 2. lấy giỏ hàng hiện tại
        const cart = await utils.getOrCreateCart(userId);
        if (!cart) {
            await transaction.rollback();
            return { err: 1, msg: "Cart not found" };
        }

        // 3. lấy các items trong giỏ hàng
        const cartItems = await db.CartItem.findAll({
            where: { cartId: cart.id },
            include: [
                { model: db.ProductVariant, as: 'productVariant' }
            ],
            transaction
        });
        if (!cartItems.length)
            return { err: 1, msg: "Cart is empty" };

        // 4. map items từ giỏ hàng sang đơn hàng
        const orderItemsData = cartItems.map(item => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.priceAtTime
        }));

        // 5. tính tổng tiền
        const totalAmount = utils.calcTotal(orderItemsData);

        // 6. check và áp dụng coupon nếu có
        let finalTotal = totalAmount;
        let appliedCoupon = null;
        if (couponCode) {
            const couponRes = await utils.checkUserCoupon(userId, couponCode, transaction);
            if (couponRes.err) {
                await transaction.rollback();
                return couponRes;
            }
            appliedCoupon = couponRes.coupon;
            finalTotal = utils.calcDiscount(
                totalAmount,
                appliedCoupon.discountType,
                appliedCoupon.discountValue
            );
        }

        // 7. check stock
        const stockCheck = await utils.checkStock(cartItems, transaction);
        if (stockCheck.err) {
            await transaction.rollback();
            return stockCheck;
        }

        // 8. tạo đơn hàng
        const orderId = utils.generateOrderId();
        const newOrder = await db.Order.create({
            id: orderId,
            userId,
            addressId,
            totalAmount: finalTotal,
            paymentMethod: paymentMethod,
            orderStatus: 'Pending',
            paymentStatus: 'Pending',
            expiresAt: paymentMethod === "ZaloPay" ? new Date(Date.now() + 15 * 60 * 1000) : null
        }, { transaction });

        // 9. tạo các order items
        const orderItems = orderItemsData.map(item => ({    
            id: nanoid(8),
            orderId: newOrder.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.price
        }));
        await db.OrderItem.bulkCreate(orderItems, { transaction });

        // Nếu là COD thì hoàn tất đơn luôn
        if (paymentMethod === "COD") {
            // 10. Trừ kho
            const stockUpdate = await utils.updateProductStock(cartItems, transaction);
            if (stockUpdate.err) {
                await transaction.rollback();
                return stockUpdate;
            }

            // 11. Đánh dấu coupon đã dùng
            if (appliedCoupon) {
                const userCoupon = await db.UserCoupon.findOne({
                    where: {
                        userId,
                        couponId: appliedCoupon.id,
                        status: "unused",
                        usedAt: null
                    },
                    transaction
                });

                if (userCoupon) {
                    await utils.markUserCouponUsed(userCoupon, transaction);
                }
            }

            // 12.  Xóa giỏ hàng
            await db.CartItem.destroy({ where: { cartId: cart.id }, transaction });

            // 13.Cập nhật trạng thái đơn
            await newOrder.update({
                orderStatus: 'Processing',
                paymentStatus: 'Pending' // chờ thu tiền khi giao
            }, { transaction });

            await transaction.commit();

            return {
                err: 0,
                msg: "Order created successfully (COD)",
                order: newOrder
            };
        }

        // Nếu ZALOPAY thì tạo payment
        if (paymentMethod === "ZaloPay") {
            const transID = Math.floor(Math.random() * 1000000);
            const appTransId = `${moment().format('YYMMDD')}_${transID}`;
            const zaloOrder = await createZaloPayOrder({
                orderId: newOrder.id,
                app_trans_id: appTransId,                  
                amount: finalTotal,
                description: `Thanh toán đơn hàng #${newOrder.id}`
            });

            // ✅ SANDBOX: coi như thanh toán thành công
            if (zaloOrder.return_code === 1) {
                // 1️⃣ Update order
                await newOrder.update({
                    paymentStatus: 'Paid',
                    orderStatus: 'Processing',
                    paymentTransactionId: zaloOrder.order_token,
                    paymentGatewayData: {
                        sandbox: true,
                        app_trans_id: appTransId,
                        zp_token: zaloOrder.order_token,
                        order_url: zaloOrder.order_url,
                        paid_at: new Date(),
                        couponId: appliedCoupon ? appliedCoupon.id : null
                    }
                }, { transaction });

                // 2️⃣ Trừ kho
                const stockUpdate = await utils.updateProductStock(cartItems, transaction);
                if (stockUpdate.err) {
                    await transaction.rollback();
                    return stockUpdate;
                }

                // 3️⃣ Đánh dấu coupon
                if (appliedCoupon) {
                    const userCoupon = await db.UserCoupon.findOne({
                        where: {
                            userId,
                            couponId: appliedCoupon.id,
                            status: "unused"
                        },
                        transaction
                    });
                    if (userCoupon) {
                        await utils.markUserCouponUsed(userCoupon, transaction);
                    }
                }

                // 4️⃣ Xóa giỏ hàng
                await db.CartItem.destroy({ where: { cartId: cart.id }, transaction });

                await transaction.commit();

                return {
                    err: 0,
                    msg: "Payment success (ZaloPay sandbox)",
                    order: newOrder,
                    paymentUrl: zaloOrder.order_url
                };
            }

            await transaction.rollback();
            return { err: 1, msg: "ZaloPay payment failed" };
        }
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

// Lấy đơn hàng của chính mình với filter và phân trang tùy chọn
export const getMyOrdersService = async (userId, query = {}) => {
    try {
        const { page, limit, hasPagination, orderStatus, paymentStatus  } = query;
        const { offset, limitNum, pageNum } = getPagination(page, limit, process.env.DEFAULT_PAGE_LIMIT);

        const where = { userId };
        if (orderStatus) where.orderStatus = orderStatus;
        if (paymentStatus) where.paymentStatus = paymentStatus;

        const { rows, count } = await db.Order.findAndCountAll({
            where,
            distinct: true,
            col: 'id',
            attributes: { exclude: ['paymentGatewayData', 'addressId'] },
            include: orderIncludes,
            order: [['createdAt', 'DESC']],
            ...(hasPagination ? { offset, limit: limitNum } : {})
        });

        return {
            err: 0,
            msg: 'Fetch my orders succesfully!',
            response: formatPaginatedResponse(rows, count, hasPagination ? pageNum : null, hasPagination ? limitNum : null)
        }
    } catch (error) {
        throw error;
    }
};

// Lấy tất cả đơn hàng (Admin) với filter và phân trang tùy chọn
export const getAllOrdersService = async (query = {}) => {
    try {
        const { page, limit, hasPagination, orderStatus, paymentStatus } = query;
        const { offset, limitNum, pageNum } = getPagination(page, limit, process.env.DEFAULT_PAGE_LIMIT);

        const where = {};
        if (orderStatus) where.orderStatus = orderStatus;
        if (paymentStatus) where.paymentStatus = paymentStatus;

        const { rows, count } = await db.Order.findAndCountAll({
            where,
            distinct: true,              
            col: 'id',
            attributes: { exclude: ['paymentGatewayData', 'addressId'] },
            include: orderIncludes,
            order: [['createdAt', 'DESC']],
            ...(hasPagination ? { offset, limit: limitNum } : {})
        });

        return formatPaginatedResponse(rows, count, hasPagination ? pageNum : null, hasPagination ? limitNum : null);
    } catch (error) {
        throw error;
    }
};

// Xem chi tiết đơn hàng (Admin) 
export const getOrderByIdService = async (orderId) => {
    try {
        const order = await db.Order.findByPk(orderId, {
            include: orderIncludes
        });

        if (!order) {
            return { err: 1, msg: 'Order not found' };
        }

        return { err: 0, msg: 'Order fetched successfully', order };
    } catch (error) {
        throw error;
    }
};

// Cập nhật trạng thái đơn hàng (Admin duyệt) 
export const confirmOrderService = async (orderId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const order = await db.Order.findByPk(orderId, { transaction });
        
        if (!order) {
            await transaction.rollback();
            return { err: 1, msg: 'Không tìm thấy đơn hàng' };
        }

        // Chỉ cho phép xác nhận khi đơn đang ở trạng thái Pending, Processing
        if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Processing') {
            await transaction.rollback();
            return { 
                err: 1, 
                msg: `Đơn hàng đang ở trạng thái "${order.orderStatus}", không thể xác nhận lại` 
            };
        }

        // Cập nhật trạng thái thành Confirmed
        await order.update(
            { orderStatus: 'Confirmed' },
            { transaction }
        );

        await transaction.commit();

        return { 
            err: 0, 
            msg: 'Đơn hàng đã được xác nhận thành công', 
            order 
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};