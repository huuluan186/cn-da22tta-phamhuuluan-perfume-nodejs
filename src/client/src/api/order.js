import axiosConfig from "./axios.config";

export const apiCreateOrder = async (addressId, couponCode=null, paymentMethod='COD') => {
    try {
        const response = await axiosConfig.post('/api/users/me/orders', {
            addressId,
            couponCode,
            paymentMethod
        })   
        return response.data;
    } catch (error) {
        throw error
    }   
}

export const apigetMyOrders = async (params={}) => {
    try {
        const response = await axiosConfig.get('/api/users/me/orders', {params})   
        return response.data;
    } catch (error) {
        throw error
    }   
}

export const apiGetAllOrdersAdmin = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/orders', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const apiGetOrderDetailAdmin = async (orderId) => {
    try {
        const response = await axiosConfig.get(`/api/admin/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const apiConfirmOrderAdmin = async (orderId) => {
    try {
        const response = await axiosConfig.patch(`/api/admin/orders/${orderId}/confirm`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};