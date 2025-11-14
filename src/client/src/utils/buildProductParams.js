export const buildProductParams = (filters) => {
    const params = {
        categoryId: filters.categoryId,
        brandIds: filters.selectedBrands.length > 0 ? filters.selectedBrands.join(',') : undefined, // chuyển mảng thành CSV
        rating: filters.rating,
        keyword: filters.keyword,
        sort: filters.sort
    };

    // Chỉ gửi priceRange nếu khác DEFAULT_PRICE_RANGE
    if (filters.price[0] !== 0 || filters.price[1] !== 1000000) {
        params.priceRange = filters.price.length > 0 
            ? filters.price.join(',') : undefined;
    }

    return params;
};
