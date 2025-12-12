import Joi from 'joi'

export const createCouponSchema = Joi.object({
    code: Joi.string()
        .trim()
        .allow(null)
        .min(4)
        .max(50)
        .optional(),

    discountType: Joi.string()
        .valid('percentage', 'fixed')
        .required(),

    discountValue: Joi.number()
        .greater(0)
        .required()
        .when('discountType', {
            is: 'percentage',
            then: Joi.number().max(100).messages({
                'number.max': 'Percentage discount cannot exceed 100'
            })
        }),

    validFrom: Joi.date()
        .allow(null)
        .optional(),

    validUntil: Joi.date()
        .allow(null)
        .optional()
})
.custom((value, helpers) => {

    const now = new Date()
    let { validFrom, validUntil } = value

    if (!validFrom) {
        value.validFrom = now
        validFrom = now
    }

    // Nếu có validUntil
    if (validUntil) {

        if (validUntil <= validFrom) {
            return helpers.message('validUntil must be later than validFrom')
        }

        if (validUntil <= now) {
            return helpers.message('validUntil must be in the future')
        }
    }

    return value
})


export const assignCouponSchema = Joi.object({
    userIds: Joi.array()
        .items(Joi.string().required())
        .min(1)
        .required()
        .messages({
            'array.base': 'userIds must be an array',
            'array.min': 'userIds must contain at least 1 user',
            'any.required': 'userIds is required'
        }),

    validFrom: Joi.date()
        .allow(null)
        .optional(),

    validUntil: Joi.date()
        .allow(null)
        .optional()

    }).custom((value, helpers) => {

    const now = new Date()
    let { validFrom, validUntil } = value

    if (!validFrom) {
        value.validFrom = now
        validFrom = now
    }

    if (validUntil) {

        if (new Date(validUntil) <= new Date(validFrom)) {
            return helpers.message('validUntil must be later than validFrom')
        }

        if (new Date(validUntil) <= now) {
            return helpers.message('validUntil must be in the future')
        }
    }

    return value
})