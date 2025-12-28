import axiosConfig from './axios.config'
import { objectToFormData } from '../utils/index'

export const apiGetProductsList = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/products', { params })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const apiGetProductDetail = async (productId) => {
    try {
        const response = await axiosConfig.get(`/api/products/${productId}`)
        return response.data;
    } catch (error) {
        throw error
    }
}

export const apiGetProductReviews = async (productId) => {
    try {
        const response = await axiosConfig.get(`/api/products/${productId}/reviews`)
        return response.data;
    } catch (error) {
        throw error
    }
}

export const apiAddProductReview = async (productId, payload) => {
    try {
        const formData = objectToFormData(payload);
        const response = await axiosConfig.post(`/api/products/${productId}/reviews`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ==================== ADMIN APIs ====================

// Lấy danh sách sản phẩm (admin)
export const apiGetProductsAdmin = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/products', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Tạo sản phẩm mới
export const apiCreateProduct = async (payload) => {
    try {
        const response = await axiosConfig.post('/api/admin/products', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cập nhật sản phẩm
export const apiUpdateProduct = async (productId, payload) => {
    try {
        const response = await axiosConfig.put(`/api/admin/products/${productId}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa sản phẩm (soft delete)
export const apiDeleteProduct = async (productId) => {
    try {
        const response = await axiosConfig.delete(`/api/admin/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Thêm variant cho sản phẩm
export const apiCreateVariant = async (productId, payload) => {
    try {
        const response = await axiosConfig.post(`/api/admin/products/${productId}/variants`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cập nhật variant
export const apiUpdateVariant = async (variantId, payload) => {
    try {
        const response = await axiosConfig.put(`/api/admin/variants/${variantId}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa variant
export const apiDeleteVariant = async (variantId) => {
    try {
        const response = await axiosConfig.delete(`/api/admin/variants/${variantId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Thêm nhiều ảnh cho sản phẩm
export const apiAddProductImages = async (productId, payload) => {
    try {
        const formData = objectToFormData(payload);
        const response = await axiosConfig.post(`/api/admin/products/${productId}/images`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa ảnh sản phẩm
export const apiDeleteProductImage = async (imageId) => {
    try {
        const response = await axiosConfig.delete(`/api/admin/products/images/${imageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiSetThumbnail = async (productId, payload) => {
    try {
        const response = await axiosConfig.patch(`/api/admin/products/${productId}/thumbnail`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};