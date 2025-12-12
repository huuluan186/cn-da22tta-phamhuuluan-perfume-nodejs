import * as service from "../services/coupon.js";
import { createCouponSchema, assignCouponSchema } from "../validations/couponValidation.js";
import { validateData } from "../validations/validation.js";

export const getMyCouponsController = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { page, limit } = req.query;

        const result = await service.getUserCoupons(userId, page, limit);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at getMyCoupons controller: ' + error.message
        })
    }
};

export const createCouponController = async (req, res) => {

    const check = validateData(createCouponSchema, req.body)
    if (!check.valid) {
        return res.status(400).json({
            err: 1,
            msg: check.msg
        })
    }

    try {
        const response = await service.createCouponService(check.data)
        return res.status(response.err === 1 ? 409 : 201).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at createCoupon controller: ' + error.message
        })
    }
}

export const assignCouponManualController = async (req, res, next) => {
    try {

        if (typeof req.body.userIds === 'string') {
            req.body.userIds = req.body.userIds.split(',').map(id => id.trim())
        }
        const { error, value } = assignCouponSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                err: 1,
                msg: error.details[0].message
            })
        }

        const result = await service.assignCouponManualService(req.params.couponId, value)
        return res.status(result.err === 0 ? 200 : 400).json(result)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at assignCouponManual controller: ' + error.message
        })
    }
}

export const autoRewardCouponController = async (req, res) => {
    try {
        const { userId } = req.body

        const result = await service.autoCreateAndAssignCouponForUser(userId)

        return res.status(200).json({
            err: 0,
            msg: "Auto coupon checked",
            result
        })
    } catch (error) {
        return res.status(500).json({
            err: 1,
            message:'Failed at autoRewardCouponController: '+ error.message
        })
    }
}

export const deleteCouponController = async (req, res) => {
    try {
        const couponId = req.params.couponId;

        const result = await service.deleteCouponService(couponId);

        return res.status(result.err === 0 ? 200 : 404).json(result);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at deleteCouponController: " + error.message
        });
    }
};

export const getAllCouponsController = async (req, res) => {
    try {
        const result = await service.getAllCouponsService(req.query);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at getAllCouponsController: " + error.message
        });
    }
};
