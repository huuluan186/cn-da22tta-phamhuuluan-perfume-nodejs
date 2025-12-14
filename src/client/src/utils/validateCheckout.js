export const validateCheckout = (formData) => {
    const errors = {}

    // ===== Địa chỉ mặc định =====
    if (!formData.receiverName?.trim())
        errors.receiverName = "Họ tên không được để trống"

    if (!formData.phone?.trim())
        errors.phone = "Số điện thoại không được để trống"

    if (!formData.addressLine?.trim())
        errors.addressLine = "Địa chỉ không được để trống"

    if (!formData.provinceId)
        errors.provinceId = "Vui lòng chọn tỉnh/thành"

    if (!formData.wardId)
        errors.wardId = "Vui lòng chọn phường/xã"
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    }
}
