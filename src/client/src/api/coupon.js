import axiosConfig from "./axios.config";

export const apiGetMyCoupons = async () => {
    try {
        const response = await axiosConfig.get('/api/users/me/coupons')   
        return response.data;
    } catch (error) {
        throw error
    }   
}

export const apiGetAllCouponsAdmin = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/coupons', { params });
        return response.data; 
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const apiCreateCoupon = async (data) => {
    try {
        const response = await axiosConfig.post('/api/admin/coupons', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const apiDeleteCoupon = async (couponId) => {
    try {
        const response = await axiosConfig.delete(`/api/admin/coupons/${couponId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const apiAssignCouponManual = async (couponId, payload) => {
    try {
        const response = await axiosConfig.post(`/api/admin/coupons/${couponId}`, payload);
        return response.data; 
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const apiAutoRewardCoupon = async () => {
    try {
        const response = await axiosConfig.post('/api/users/me/auto-reward');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};