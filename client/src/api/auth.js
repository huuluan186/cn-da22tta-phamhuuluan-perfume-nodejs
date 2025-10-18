import axiosConfig from "./axios.config";

export const apiRegister = async (payload) => {
    try {
        const response = await axiosConfig.post('/api/auth/register', payload)
        return response;
    } catch (error) {
        throw error
    }
}

export const apiLogin = async (payload) => {
    try {
        const response = await axiosConfig.post('/api/auth/login', payload)
        return response;
    } catch (error) {
        throw error
    }
}
