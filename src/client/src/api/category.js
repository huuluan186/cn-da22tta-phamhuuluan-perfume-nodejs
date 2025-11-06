import axiosConfig from "./axios.config";

export const apiGetAllCategories = async () => {
    try {
        const response = await axiosConfig.get('/api/categories')   
        return response;
    } catch (error) {
        throw error
    }   
}