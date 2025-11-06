import axiosConfig from "./axios.config";

export const apiGetAllBrands = async () => {
    try {
        const response = await axiosConfig.get('/api/brands')   
        return response;
    } catch (error) {
        throw error
    }   
}