import axiosConfig from './axios.config'

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