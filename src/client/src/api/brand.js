import axiosConfig from "./axios.config";

export const apiGetAllBrands = async () => {
    try {
        const response = await axiosConfig.get('/api/brands')   
        return response;
    } catch (error) {
        throw error
    }   
}

export const apiGetBrandDetail = async (brandId) => {
    try {
        const response = await axiosConfig.get(`/api/brands/${brandId}`)   
        return response;
    } catch (error) {
        throw error
    }   
}