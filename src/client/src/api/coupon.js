import axiosConfig from "./axios.config";

export const apiGetMyCoupons = async () => {
    try {
        const response = await axiosConfig.get('/api/users/me/coupons')   
        return response.data;
    } catch (error) {
        throw error
    }   
}