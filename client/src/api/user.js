import axiosConfig from "./axios.config";

export const apiGetCurrentUser = async () => {
    try {
        const response = await axiosConfig.get('/api/users/me')
        return response;
    } catch (error) {
        throw error
    }
}

export const apiUpdateCurrentUser = async (data) => {
    try {
        const response = await axiosConfig.put('/api/users/me', data)
        return response;
    } catch (error) {
        throw error
    }
}

export const apiForgotPassword = async (email) => {
    try {
        const response = await axiosConfig.post('/api/users/forgot-password', email)
        return response;
    } catch (error) {
        throw error
    }
}

export const apiResetPassword = async (resetData) => {
    try {
        const response = await axiosConfig.post('/api/users/reset-password', resetData)
        return response;
    } catch (error) {
        throw error
    }
}