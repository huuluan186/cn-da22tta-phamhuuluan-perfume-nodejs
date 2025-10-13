/**
 * Hook xử lý tự động tính giá bán (price) từ originalPrice và discountPercent.
 * - Nếu có discountPercent → tính giảm giá.
 * - Nếu discountPercent null hoặc 0 → price = originalPrice.
 */

export const productVariantHooks = {
    beforeValidate: (variant) => {
        if (variant.originalPrice && variant.discountPercent != null) {
            const discount = variant.discountPercent / 100;
            variant.price = variant.originalPrice * (1 - discount);
        } else {
            variant.price = variant.originalPrice;
        }
    }
};