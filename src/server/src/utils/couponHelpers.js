import db from '../models/index.js';
import { nanoid } from 'nanoid';

export const getOrCreateCoupon = async ({
    code,
    discountType = 'percentage', // or 'fixed'
    discountValue = 10,
    maxDiscount = 50000,
    minOrderValue = 0,
    validUntil = null
}) => {
    let coupon = await db.Coupon.findOne({ where: { code } })

    if (!coupon) {
        coupon = await db.Coupon.create({
            id: nanoid(4),
            code,
            discountType,
            discountValue,
            maxDiscount,
            minOrderValue,
            validFrom: new Date(),
            validUntil
        })
    }

    return coupon
}

export const checkUserCoupon = async (userId, couponCode, transaction = null) => {
    try {
        if (!couponCode) {
            return {
                err: 0,
                discountAmount: 0,
                coupon: null,
                userCoupon: null
            }
        }
    
        // tìm coupon theo code
        const coupon = await db.Coupon.findOne({
            where: { code: couponCode },
            transaction
        });
        if (!coupon) 
            return { err: 1, msg: 'Coupon not found' };
        

        // kiểm tra coupon đã được dùng chưa
        const userCoupon = await db.UserCoupon.findOne({
            where: {
                userId,
                couponId: coupon.id,
                status: "unused",
                usedAt: null
            },
            transaction
        });
        if (!userCoupon)
            return { err: 1, msg: 'Coupon already used or not assigned to user'};

        // kiểm tra ngày hợp lệ
        const now = new Date();
        if (userCoupon.validFrom && now < userCoupon.validFrom) {
            console.log("validFrom:", userCoupon.validFrom, "Now:", now);
            return { err: 1, msg: 'Coupon not valid yet' };
        }
        if (userCoupon.validUntil && now > userCoupon.validUntil) {
            await markUserCouponExpired(userCoupon, transaction)
            return { err: 1, msg: 'Coupon expired' };
        }

        return {
            err: 0,
            msg: 'Coupon is valid',
            coupon, 
            userCoupon
        }
    } catch (error) {
        throw error;
    }
}

export const markUserCouponUsed = async (userCoupon, transaction) => {
    if (!userCoupon) return;

    await userCoupon.update({
        status: 'used',
        usedAt: new Date()
    }, { transaction });
}

export const markUserCouponExpired = async (userCoupon, transaction = null) => {
    if (!userCoupon) return

    await userCoupon.update({
        status: 'expired'
    }, { transaction })
}

export const generateAmountCode = (totalAmount) => {
    const milestone = Math.floor(totalAmount / 2000000) * 2000000

    if (milestone < 2000000) return null

    return `AMOUNT${milestone / 1000}` // AMOUNT2000 – 4000 – 6000
}

export const COUPON_RULES = {
    WELCOME: {
        code: 'WELCOME',
        discountType: 'fixed',
        discountValue: 20000
    },

    ORDER5TH: {
        code: 'ORDER5TH',
        discountType: 'percentage',
        discountValue: 10    
    },

    MILESTONE: {
        prefix: 'MILESTONE',
        step: 2000000, // mỗi 2tr
        discountType: 'percentage',
        discountValue: 15,
    }
}

export const assignCouponToUser = async (userId, coupon, transaction = null) => {
    if (!coupon) return null

    const existed = await db.UserCoupon.findOne({
        where: {
            userId,
            couponId: coupon.id
        },
        transaction
    })

    if (existed) return null

    return await db.UserCoupon.create({
        id: nanoid(6),
        userId,
        couponId: coupon.id,
        status: "unused",
        validFrom: new Date()
    }, { transaction })
}
