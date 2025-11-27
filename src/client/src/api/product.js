import axiosConfig from './axios.config'
import { objectToFormData } from '../utils/index'

export const apiGetProductsList = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/products', { params })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const apiGetProductDetail = async (productId) => {
    try {
        const response = await axiosConfig.get(`/api/products/${productId}`)
        return response.data;
    } catch (error) {
        throw error
    }
}

export const apiGetProductReviews = async (productId) => {
    try {
        const response = await axiosConfig.get(`/api/products/${productId}/reviews`)
        return response.data;
    } catch (error) {
        throw error
    }
}

export const apiAddProductReview = async (productId, payload) => {
    try {
        const formData = objectToFormData(payload);
        const response = await axiosConfig.post(`/api/products/${productId}/reviews`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
