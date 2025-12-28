import axiosConfig from "./axios.config";

/**
 * ============== CATEGORY (PUBLIC) ==============
 */
export const apiGetAllCategories = async () => {
    try {
        const response = await axiosConfig.get('/api/categories');
        return response;
    } catch (error) {
        throw error;
    }
};


export const apiGetCategoryDetail = async (categoryId) => {
    try {
        const response = await axiosConfig.get(`/api/admin/categories/${categoryId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * ============== CATEGORY (ADMIN) ==============
 */
export const apiGetAllCategoriesAdmin = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/categories', {
            params,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiCreateCategory = async (categoryData) => {
    try {
        const response = await axiosConfig.post(
            '/api/admin/categories',
            categoryData
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiUpdateCategory = async (categoryId, updateData) => {
    try {
        const response = await axiosConfig.put(
            `/api/admin/categories/${categoryId}`,
            updateData
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiDeleteCategory = async (categoryId) => {
    try {
        const response = await axiosConfig.delete(
            `/api/admin/categories/${categoryId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
