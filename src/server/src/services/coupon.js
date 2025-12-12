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
            distinct: true,
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
        const { code, discountType, discountValue, validFrom, validUntil } = data

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
            validFrom,
            validUntil,
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
            validFrom: validFrom || coupon.validFrom || now,
            validUntil: validUntil || coupon.validUntil || null
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
        MILESTONE: null
    }

    /* ---------------- 1. ĐĂNG KÝ (WELCOME) ---------------- */
    const totalOrders = await db.Order.count({
        where: { userId },
        transaction
    })

    if (totalOrders === 0) {
        const rule = COUPON_RULES.WELCOME

        const coupon = await getOrCreateCoupon({
            code: rule.code,
            discountType: rule.discountType,
            discountValue: rule.discountValue
        })

        result.WELCOME = await assignCouponToUser(userId, coupon, transaction)
    }


    /* ---------------- 2. ĐỦ 5 ĐƠN (ORDER5TH) ---------------- */
    const completedOrders = await db.Order.count({
        where: { userId, orderStatus: "Completed" },
        transaction
    })

    if (completedOrders === 5) {
        const rule = COUPON_RULES.ORDER5TH

        const coupon = await getOrCreateCoupon({
            code: rule.code,
            discountType: rule.discountType,
            discountValue: rule.discountValue
        })

        result.ORDER5TH = await assignCouponToUser(userId, coupon, transaction)
    }

    /* ---------------- 3. MỐC 2TR - 4TR - 6TR... (MILESTONE) ---------------- */
    const orders = await db.Order.findAll({
        where: { userId, orderStatus: "Completed" },
        attributes: ['totalAmount'],
        transaction
    })

    const totalAmount = orders.reduce((sum, order) => {
        return sum + Number(order.totalAmount)
    }, 0)

    const milestoneCode = generateAmountCode(totalAmount)

    if (milestoneCode) {
        const coupon = await getOrCreateCoupon({
            code: milestoneCode,
            discountType: COUPON_RULES.MILESTONE.discountType,
            discountValue: COUPON_RULES.MILESTONE.discountValue
        })

        result.MILESTONE = await assignCouponToUser(userId, coupon, transaction)
    }

    return result
}

// === 4. Xoá coupon (Admin) ===
export const deleteCouponService = async (couponId) => {
    try {
        const coupon = await db.Coupon.findByPk(couponId);

        if (!coupon)
            return { err: 1, msg: "Coupon not found" };

        await coupon.destroy(); 

        return {
            err: 0,
            msg: "Coupon soft deleted successfully"
        };

    } catch (error) {
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
