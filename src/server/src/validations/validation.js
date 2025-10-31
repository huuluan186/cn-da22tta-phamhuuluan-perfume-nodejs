// hàm tổng quát, có thể tái sử dụng cho mọi schema
export const validateData = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const msg = error.details.map(d => d.message).join(', ');
        return { valid: false, msg };
    }
    return { valid: true, data: value };
};