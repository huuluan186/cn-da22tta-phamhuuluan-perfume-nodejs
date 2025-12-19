import axiosConfig from "./axios.config";

export const apiSentContactMessage = async (payload) => {
    try {
        const response = await axiosConfig.post('/api/contacts', payload)   
        return response.data;
    } catch (error) {
        throw error
    }   
}