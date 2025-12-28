import axiosConfig from './axios.config';

export const apiGetKPIs = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/statistics/kpis', { params });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const apiGetRevenueTrend = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/statistics/revenue-trend', { params });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const apiGetTopProducts = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/statistics/top-products', { params });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const apiGetRevenueByCategory = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/statistics/revenue-by-category', { params });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const apiGetRevenueByBrand = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/statistics/revenue-by-brand', { params });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const apiGetRevenueByPayment = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/statistics/revenue-by-payment', { params });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const apiGetTopCustomers = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/statistics/top-customers', { params });
        return response.data;
    } catch (error) {
        throw error
    }
};