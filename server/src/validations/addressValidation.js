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
