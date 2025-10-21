import Joi from 'joi';

export const registerSchema = Joi.object({
    firstname: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Họ không được để trống',
        'string.min': 'Họ phải có ít nhất 2 ký tự',
        'any.required': 'Thiếu trường firstname'
    }),
    lastname: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Tên không được để trống',
        'any.required': 'Thiếu trường lastname'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Thiếu trường email'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Thiếu trường password'
    }),
    isAdmin: Joi.boolean().default(false)
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Thiếu trường email'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Mật khẩu không được để trống',
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Thiếu trường password'
    })
});

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(6).required().messages({
        'string.empty': 'Mật khẩu cũ không được để trống',
        'string.min': 'Mật khẩu cũ phải có ít nhất 6 ký tự',
        'any.required': 'Thiếu trường oldPassword'
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.empty': 'Mật khẩu mới không được để trống',
        'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
        'any.required': 'Thiếu trường newPassword'
    })
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Thiếu trường email'
    })
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'string.empty': 'Token không được để trống',
        'any.required': 'Thiếu trường token'
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.empty': 'Mật khẩu mới không được để trống',
        'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
        'any.required': 'Thiếu trường newPassword'
    })
});

// hàm tổng quát, có thể tái sử dụng cho mọi schema
export const validateData = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const msg = error.details.map(d => d.message).join(', ');
        return { valid: false, msg };
    }
    return { valid: true, data: value };
};
