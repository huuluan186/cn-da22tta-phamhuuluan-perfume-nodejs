import actionTypes from './actionTypes'
import { apiGetAllCountries, apiGetProvincesByCountry, apiGetWardsByProvince } from '../../api/location'

//Lấy danh sách quốc gia
export const getCountries = () => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.GET_COUNTRIES_REQUEST });
        const res = await apiGetAllCountries();
        if (res?.data?.err === 0) {
            dispatch({ type: actionTypes.GET_COUNTRIES_SUCCESS, payload: res.data.response });
        } else {
            dispatch({ type: actionTypes.GET_COUNTRIES_FAIL, payload: res?.data?.msg });
        }
    } catch (err) {
        dispatch({ type: actionTypes.GET_COUNTRIES_FAIL, payload: err.message });
    }
};

// Lấy danh sách tỉnh/thành theo quốc gia
export const getProvincesByCountry = (countryId) => async (dispatch) => {
    const res = await apiGetProvincesByCountry(countryId);
    if (res?.data?.err === 0)
        dispatch({ type: actionTypes.GET_PROVINCES_SUCCESS, payload: res.data.response });
};

// 🏘️ Lấy danh sách phường/xã theo tỉnh/thành
export const getWardsByProvince = (provinceId) => async (dispatch) => {
    const res = await apiGetWardsByProvince(provinceId);
    if (res?.data?.err === 0)
        dispatch({ type: actionTypes.GET_WARDS_SUCCESS, payload: res.data.response });
};