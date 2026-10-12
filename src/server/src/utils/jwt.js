/**
 * Tạo JWT và set cookie HttpOnly
 * @param {Object} res - Response object
 * @param {Object} user - Dữ liệu user (phải có id, isAdmin)
 * @param {String} secretKey - Secret key của JWT
 */
const getAuthCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        // Client và API deploy trên 2 domain khác nhau (Render) => cần SameSite=None để cookie được gửi kèm
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };
};

export const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        ...getAuthCookieOptions(),
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 ngày
    });

    return token; // Trả về token nếu cần (ví dụ để log)
};

/**
 * Hàm xóa cookie khi logout
 */
export const clearAuthCookie = (res) => {
    res.clearCookie("token", getAuthCookieOptions());
};
