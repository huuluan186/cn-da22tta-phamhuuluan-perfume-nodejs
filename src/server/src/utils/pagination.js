/**
 * Tính toán pagination cho Sequelize
 * @param {string|number} page - Trang hiện tại
 * @param {string|number} limit - Số item / page
 * @param {number} defaultLimit - Giá trị limit mặc định
 * @returns {Object} { offset, limitNum, pageNum, hasPagination }
 */
export const getPagination = (page, limit, defaultLimit = 10) => {
    let hasPagination = false;
    const pageNum = Number(page) || 1;

    let limitNum;
    if (limit !== undefined) {
        limitNum = limit && +limit > 0 ? +limit : +defaultLimit || 8;
        hasPagination = page !== undefined && page !== '' && limitNum > 0;
    } else {
        limitNum = +defaultLimit;
    }

    const offset = hasPagination ? (pageNum - 1) * limitNum : 0;

    return { offset, limitNum, pageNum, hasPagination };
};

/**
 * Format response pagination
 * @param {Array} rows - dữ liệu trả về
 * @param {number} total - tổng số item
 * @param {number|null} pageNum - trang hiện tại
 * @param {number|null} limitNum - limit
 */
export const formatPaginatedResponse = (rows, total, pageNum = null, limitNum = null) => {
    return {
        total,
        page: pageNum,
        limit: limitNum,
        data: rows
    };
};
