import axiosConfig from "./axios.config";

// Lấy danh sách tất cả tỉnh/thành 
export const apiGetAllProvinces = async () => {
    try {
        const response = await axiosConfig.get(`/api/locations/provinces`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Lấy danh sách phường/xã theo provinceId
export const apiGetWardsByProvince = async (provinceId) => {
    try {
        const response = await axiosConfig.get(`/api/locations/provinces/${provinceId}/wards`);
        return response;
    } catch (error) {
        throw error;
    }
};