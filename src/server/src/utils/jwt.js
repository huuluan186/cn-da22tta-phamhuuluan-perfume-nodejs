/**
 * Tạo JWT và set cookie HttpOnly
 * @param {Object} res - Response object
 * @param {Object} user - Dữ liệu user (phải có id, isAdmin)
 * @param {String} secretKey - Secret key của JWT
 */
export const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 ngày
    });

    return token; // Trả về token nếu cần (ví dụ để log)
};

/**
 * Hàm xóa cookie khi logout
 */
export const clearAuthCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
};
