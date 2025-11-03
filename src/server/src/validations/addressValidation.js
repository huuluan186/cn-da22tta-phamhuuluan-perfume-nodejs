import Joi from 'joi';

export const validateAddressByCountry = (addressInstance) => {
    let { countryId, provinceId, wardId } = addressInstance;

    if (!countryId) countryId = 236;

    // Nếu là Việt Nam
    if (countryId !== 236) {
        if (provinceId || wardId) throw new Error('Không được chọn tỉnh/phường khi quốc gia khác Việt Nam.');
    } 
};

export const addressSchema = Joi.object({
    receiverName: Joi.string().required().messages({
        'string.empty': 'Tên người nhận không được để trống',
        'any.required': 'Tên người nhận là bắt buộc',
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'Số điện thoại không được để trống',
        'any.required': 'Số điện thoại là bắt buộc',
    }),
    addressLine: Joi.allow(null, '').optional(),
    wardId: Joi.allow(null, '').optional(),
    label: Joi.string().allow(null, '').optional(),
    isDefault: Joi.boolean().optional(),
    zipCode: Joi.string().allow(null, '').optional(),
});
