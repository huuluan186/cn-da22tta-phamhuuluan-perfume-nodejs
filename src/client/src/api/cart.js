import axiosConfig from "./axios.config";

export const apiAddToCart = async (productVariantId, quantity) => {
    try {
        const response = await axiosConfig.post('/api/users/me/cart', {
            productVariantId,
            quantity
        })   
        return response.data;
    } catch (error) {
        throw error
    }   
}

export const apiGetMyCart = async () => {
    try {
        const response = await axiosConfig.get('/api/users/me/cart')   
        return response.data;
    } catch (error) {
        throw error
    }   
}

export const apiUpdateQuantity = async (cartItemId, quantity) => {
    try {
        const response = await axiosConfig.put(`/api/users/me/cart/${cartItemId}`, quantity)   
        return response.data;
    } catch (error) {
        throw error
    }   
}

export const apiDeleteACartItems = async (cartItemId) => {
    try {
        const response = await axiosConfig.delete(`/api/users/me/cart/${cartItemId}`)   
        return response.data;
    } catch (error) {
        throw error
    }   
}

export const apiClearCart = async () => {
    try {
        const response = await axiosConfig.delete(`/api/users/me/cart`)   
        return response.data;
    } catch (error) {
        throw error
    }   
}