import axiosConfig from "./axios.config";

// Lấy danh sách tất cả quốc gia
export const apiGetAllCountries = async () => {
    try {
        const response = await axiosConfig.get('/api/locations/countries')
        return response;
    } catch (error) {
        throw error
    }
};

// Lấy danh sách tỉnh/thành theo countryId
export const apiGetProvincesByCountry = async (countryId) => {
    try {
        const response = await axiosConfig.get(`/api/locations/countries/${countryId}/provinces`);
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