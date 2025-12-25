import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';
import { COUPON_RULES, generateAmountCode, assignCouponToUser, getOrCreateCoupon } from '../utils/couponHelpers.js';
import db from '../models/index.js';
import { Op, col } from "sequelize";
import { nanoid } from 'nanoid';

// === 1. Lấy danh sách coupon của user (User) ===
export const getUserCoupons = async (userId, page, limit) => {
    try {
        const { offset, limitNum, pageNum, hasPagination } = getPagination(page, limit, process.env.DEFAULT_PAGE_LIMIT);

        const where = { userId };

        const { rows, count } = await db.UserCoupon.findAndCountAll({
            where,
            include: [
                {
                    model: db.Coupon,
                    as: 'coupon',
                }
            ],
            order: [
                [db.sequelize.where(col('usedAt'), Op.is, null), 'DESC'],  
                ['createdAt', 'ASC']  
            ],
            //distinct: true,
            ...(hasPagination ? { offset, limit: limitNum } : {})
        });

        const coupons = rows.map(uc => ({
            id: uc.coupon.id,
            code: uc.coupon.code,
            discountType: uc.coupon.discountType,
            discountValue: uc.coupon.discountValue,
            status: uc.status,
            usedAt: uc.usedAt,
            validFrom: uc.validFrom,
            validUntil: uc.validUntil
        }));

        return {
            err: 0,
            msg: 'Get user coupons successfully',
            response: formatPaginatedResponse(coupons, count, hasPagination ? pageNum : null, hasPagination ? limitNum : null)
        };
    } catch (error) {
        throw error;
    }
};

// === 2. Tạo coupon mới (Admin) ===
export const createCouponService = async (data) => {
    try {
        const { code, discountType, discountValue} = data

        const existed = await db.Coupon.findOne({ where: { code } })
        if (existed) {
            return {
                err: 1,
                msg: 'Coupon code already exists'
            }
        }

        const newCoupon = await db.Coupon.create({
            id: nanoid(4),
            code: code?.trim(),
            discountType,
            discountValue,
        })

        return {
            err: 0,
            msg: 'Create coupon successfully',
            coupon: newCoupon
        }
    } catch (error) {
        throw error;
    }
}

export const assignCouponManualService = async (couponId, payload) => {
    const transaction = await db.sequelize.transaction()

    try {
        const { userIds, validFrom, validUntil } = payload

        // 1. Check coupon tồn tại
        const coupon = await db.Coupon.findByPk(couponId, { transaction })
        if (!coupon) {
            await transaction.rollback()
            return {
                err: 1,
                msg: 'Coupon not found'
            }
        }

        // 3. Lấy user hợp lệ từ userIds
        const users = await db.User.findAll({
            where: { id: userIds },
            attributes: ['id'],
            transaction
        })

        if (!users.length) {
            await transaction.rollback()
            return {
                err: 1,
                msg: 'No valid users found'
            }
        }

        const userIdsList = users.map(u => u.id)

        // 4. Kiểm tra user đã có coupon này chưa
        const existing = await db.UserCoupon.findAll({
            where: {
                userId: userIdsList,
                couponId
            },
            attributes: ['userId'],
            transaction
        })

        const existingUserIds = existing.map(e => e.userId)

        // 5. Lấy danh sách user cần thêm mới
        const newUserIds = userIdsList.filter(id => !existingUserIds.includes(id))

        if (!newUserIds.length) {
            await transaction.rollback()
            return {
                err: 1,
                msg: 'All selected users already have this coupon'
            }
        }

        // 6. Chuẩn bị rows insert
        const rows = newUserIds.map(uid => ({
            id: nanoid(6),
            userId: uid,
            couponId,
            status: 'unused',
            usedAt: null,
            validFrom: validFrom || new Date(),
            validUntil: validUntil || null
        }))

        // 7. Insert
        await db.UserCoupon.bulkCreate(rows, { transaction })

        await transaction.commit()

        return {
            err: 0,
            msg: 'Assign coupon successfully',
            assigned: rows.length,
            skipped: existingUserIds.length // số user đã có coupon
        }

    } catch (error) {
        await transaction.rollback()
        throw error
    }
}


// === 3. Tự động tạo và gán coupon cho user khi đạt điều kiện ===
export const autoCreateAndAssignCouponForUser = async (userId, transaction = null) => {
    const result = {
        WELCOME: null,
        ORDER5TH: null,
        MILESTONE: []
    };

    const t = transaction || await db.sequelize.transaction();

    try {
        // ===== 1. WELCOME COUPON - Gán nếu chưa có =====
        const hasWelcome = await db.UserCoupon.findOne({
            where: { userId },
            include: [{
                model: db.Coupon,
                as: 'coupon',
                where: { code: COUPON_RULES.WELCOME.code }
            }],
            transaction: t
        });

        if (!hasWelcome) {
            const coupon = await getOrCreateCoupon({
                code: COUPON_RULES.WELCOME.code,
                discountType: COUPON_RULES.WELCOME.discountType,
                discountValue: COUPON_RULES.WELCOME.discountValue
            }, t);

            const assigned = await assignCouponToUser(userId, coupon, t);
            result.WELCOME = assigned ? 'Gán WELCOME thành công' : null;
        }

        // ===== 2. ORDER5TH - Chỉ gán đúng khi đủ 5 đơn Completed và chưa có =====
        const completedOrders = await db.Order.count({
            where: { userId, orderStatus: "Completed" },
            transaction: t
        });

        const hasOrder5th = await db.UserCoupon.findOne({
            where: { userId },
            include: [{
                model: db.Coupon,
                as: 'coupon',
                where: { code: COUPON_RULES.ORDER5TH.code }
            }],
            transaction: t
        });

        if (completedOrders >= 5 && !hasOrder5th) {  // >= để tránh bỏ lỡ nếu >5
            const coupon = await getOrCreateCoupon({
                code: COUPON_RULES.ORDER5TH.code,
                discountType: COUPON_RULES.ORDER5TH.discountType,
                discountValue: COUPON_RULES.ORDER5TH.discountValue
            }, t);

            const assigned = await assignCouponToUser(userId, coupon, t);
            result.ORDER5TH = assigned ? 'Gán ORDER5TH thành công' : null;
        }

        // ===== 3. MILESTONE - Gán TẤT CẢ các mốc chưa có =====
        const orders = await db.Order.findAll({
            where: { userId, orderStatus: "Completed" },
            attributes: ['totalAmount'],
            transaction: t
        });

        const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

        // Lấy các milestone coupon user đã có
        const existingMilestones = await db.UserCoupon.findAll({
            where: { userId },
            include: [{
                model: db.Coupon,
                as: 'coupon',
                where: { code: { [Op.like]: 'AMOUNT%' } }
            }],
            transaction: t
        });

        const existingCodes = existingMilestones.map(uc => uc.coupon.code);

        // Tính tất cả mốc từ 2tr đến mốc cao nhất hiện tại
        const maxMilestone = Math.floor(totalAmount / 2000000) * 2000000;
        const newMilestones = [];

        for (let m = 2000000; m <= maxMilestone; m += 2000000) {
            const code = `AMOUNT${m / 1000}`;
            if (!existingCodes.includes(code)) {
                newMilestones.push(code);
            }
        }

        for (const code of newMilestones) {
            const coupon = await getOrCreateCoupon({
                code,
                discountType: COUPON_RULES.MILESTONE.discountType,
                discountValue: COUPON_RULES.MILESTONE.discountValue
            }, t);

            const assigned = await assignCouponToUser(userId, coupon, t);
            if (assigned) {
                result.MILESTONE.push(code);
            }
        }

        if (transaction === null) {
            await t.commit();
        }

        return result;

    } catch (error) {
        if (transaction === null) {
            await t.rollback();
        }
        throw error;
    }
};

// === 5. Lấy tất cả coupon (Admin) ===
export const getAllCouponsService = async (query) => {
    try {
        const { page, limit, code } = query;

        const { offset, limitNum, pageNum, hasPagination } =
            getPagination(page, limit, process.env.DEFAULT_PAGE_LIMIT);

        const where = {};

        if (code)
            where.code = { [Op.like]: `%${code}%` };

        const { rows, count } = await db.Coupon.findAndCountAll({
            where,
            paranoid: false,
            order: [["createdAt", "DESC"]],
            ...(hasPagination ? { offset, limit: limitNum } : {})
        });

        return {
            err: 0,
            msg: "Get coupons successfully",
            response: formatPaginatedResponse(
                rows,
                count,
                hasPagination ? pageNum : null,
                hasPagination ? limitNum : null
            )
        };

    } catch (error) {
        throw error;
    }
};

export const deleteCouponService = async (couponId) => {
    try {
        const coupon = await db.Coupon.findByPk(couponId);

        if (!coupon) {
            return { err: 1, msg: "Coupon not found" };
        }

        // XÓA CỨNG - destroy() sẽ xóa hoàn toàn khỏi DB
        await coupon.destroy();

        return {
            err: 0,
            msg: "Coupon deleted permanently"
        };
    } catch (error) {
        throw error;
    }
};