import Joi from 'joi';

export const validateAddressByCountry = (addressInstance) => {
    const { countryId, provinceId, wardId, addressLine } = addressInstance;

    // Nếu là Việt Nam
    if (countryId === 'VN') {
        if (!provinceId) {
            throw new Error('Phải chọn tỉnh/thành khi quốc gia là Việt Nam.');
        }
        if (!wardId) {
            throw new Error('Phải chọn phường/xã khi quốc gia là Việt Nam.');
        }
    } 
    // Nếu là nước khác
    else {
        if (!addressLine) {
            throw new Error('Chỉ tự nhập địa chỉ chi tiết (addressLine) cho quốc gia khác.');
        }
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
    addressLine: Joi.string().required().messages({
        'string.empty': 'Địa chỉ không được để trống',
        'any.required': 'Địa chỉ là bắt buộc',
    }),
    wardId: Joi.allow(null, '').optional(),
    label: Joi.string().allow(null, '').optional(),
    isDefault: Joi.boolean().optional(),
    zipCode: Joi.string().allow(null, '').optional(),
});
