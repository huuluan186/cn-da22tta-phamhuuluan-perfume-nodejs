import actionTypes from './actionTypes'
import { apiGetAllProvinces, apiGetWardsByProvince } from '../../api/location'

// Lấy danh sách tất cả tỉnh/thành
export const getAllProvinces = () => async (dispatch) => {
    const res = await apiGetAllProvinces();
    if (res?.data?.err === 0)
        dispatch({ type: actionTypes.GET_PROVINCES_SUCCESS, payload: res.data.response });
};

// 🏘️ Lấy danh sách phường/xã theo tỉnh/thành
export const getWardsByProvince = (provinceId) => async (dispatch) => {
    const res = await apiGetWardsByProvince(provinceId);
    if (res?.data?.err === 0)
        dispatch({ type: actionTypes.GET_WARDS_SUCCESS, payload: res.data.response });
};