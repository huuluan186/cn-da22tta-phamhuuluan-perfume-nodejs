import axiosConfig from "./axios.config";

export const apiGetAllPublicBrands = async () => {
    try {
        const response = await axiosConfig.get('/api/brands')   
        return response;
    } catch (error) {
        throw error
    }   
}

export const apiGetBrandDetail = async (brandId) => {
    try {
        const response = await axiosConfig.get(`/api/brands/${brandId}`)   
        return response;
    } catch (error) {
        throw error
    }   
}


// ============== BRAND (ADMIN) ============== //

export const apiGetAllBrandsAdmin = async (params = {}) => {
    try {
        const response = await axiosConfig.get('/api/admin/brands', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiCreateBrand = async (brandData) => {
    try {
        const response = await axiosConfig.post('/api/admin/brands', brandData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiUpdateBrand = async (brandId, updateData) => {
    try {
        const response = await axiosConfig.put(
            `/api/admin/brands/${brandId}`,
            updateData
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiDeleteBrand = async (brandId) => {
    try {
        const response = await axiosConfig.delete(
            `/api/admin/brands/${brandId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}