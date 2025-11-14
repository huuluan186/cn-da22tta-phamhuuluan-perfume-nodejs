// Khoảng giá mặc định trong filter
export const DEFAULT_PRICE_RANGE = [0, 1_000_000];

// Giá tối thiểu thanh trượt
export const MIN_PRICE = 0;

// Giá tối đa thanh trượt
export const MAX_PRICE = 20_000_000;

// Bước nhảy của slider
export const PRICE_STEP = 50_000;

// Format 1 số thành tiền VND
export const formatPrice = (value) => {
    if (value == null) return "";
    return value.toLocaleString("vi-VN");
};

// Format 1 khoảng giá
export const formatPriceRange = ([min, max]) => {
    return `${formatPrice(min)} - ${formatPrice(max)}`;
};

// Format price object từ minPrice/maxPrice hoặc price
export const formatProductPrice = (product) => {
    if (!product) return "";

    const { minPrice, maxPrice, price } = product;

    if (minPrice != null && maxPrice != null) {
        return minPrice !== maxPrice
        ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
        : formatPrice(minPrice);
    }

    if (price != null) return formatPrice(price);

    return "";
};
