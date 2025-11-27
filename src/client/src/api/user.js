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

export const apiChangePassword = async (data) => {
    try {
        const response = await axiosConfig.put('/api/users/me/password', data)
        return response;
    } catch (error) {
        throw error
    }
}

// ============== ADDRESS ============== //
export const apiGetMyAddress = async () => {
    try {
        const response = await axiosConfig.get('/api/users/me/addresses')
        return response;
    } catch (error) {
        throw error
    }
}

export const apiAddAddress = async (addressData) => {
    try {
        const response = await axiosConfig.post('/api/users/me/addresses', addressData)
        return response;
    } catch (error) {
        throw error
    }
}

export const apiUpdateAddress = async (addressId, updatedData) => {
    try {
        const response = await axiosConfig.put(`/api/users/me/addresses/${addressId}`, updatedData)
        return response;
    } catch (error) {
        throw error
    }
}

export const apiDeleteAddress = async (addressId) => {
    try {
        const response = await axiosConfig.delete(`/api/users/me/addresses/${addressId}`)
        return response;
    } catch (error) {
        throw error
    }
}

export const apiGetMyFavorites = async () => {
    try {
        const response = await axiosConfig.get('/api/users/me/favorites');
        return response;
    } catch (error) {
        throw error;
    }
}

export const apiAddFavorite = async (productId) => {
    try {
        const response = await axiosConfig.post(`/api/users/me/favorites/${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const apiRemoveFavorite = async (productId) => {
    try {
        const response = await axiosConfig.delete(`/api/users/me/favorites/${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
}