import axiosConfig from './axios.config'

export const apiGetProductsList = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/products', { params })
        return response.data;
    } catch (error) {
        throw error
    }
}