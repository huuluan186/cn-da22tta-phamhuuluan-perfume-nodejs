import axiosConfig from './axios.config'

// Lấy danh sách tất cả review (dùng cho trang quản trị)
export const apiGetReviewsAdmin = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/reviews', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiReviewDetailAdmin = async (reviewId) => {
    try {
        const response = await axiosConfig.get(`/api/admin/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa mềm một review (admin)
export const apiDeleteReviewAdmin = async (reviewId) => {
    try {
        const response = await axiosConfig.delete(`/api/admin/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Duyệt / Ẩn review (thay đổi trạng thái isApproved)
export const apiToggleReviewApproval = async (reviewId, isApproved) => {
    try {
        const response = await axiosConfig.patch(
            `/api/admin/reviews/${reviewId}`,
            { isApproved } // body: { isApproved: true/false }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};