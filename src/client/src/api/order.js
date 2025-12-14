import axiosConfig from "./axios.config";

export const apiCreateOrder = async (addressId, couponCode=null, paymentMethod='COD') => {
    try {
        const response = await axiosConfig.post('/api/users/me/orders', {
            addressId,
            couponCode,
            paymentMethod
        })   
        return response.data;
    } catch (error) {
        throw error
    }   
}

export const apigetMyOrders = async () => {
    try {
        const response = await axiosConfig.get('/api/users/me/orders')   
        return response.data;
    } catch (error) {
        throw error
    }   
}