import actionTypes from './actionTypes'
import { apiGetAllPublicBrands, apiGetBrandDetail, apiGetAllBrandsAdmin } from '../../api/brand'

export const getAllBrands = () => async (dispatch) => {
    try {
        const res = await apiGetAllPublicBrands();
        if(res?.data?.err === 0 ){
            dispatch({ 
                type: actionTypes.GET_BRANDS_SUCCESS, 
                brands: res.data.brands
            });
        } else {
            dispatch({ 
                type: actionTypes.GET_BRANDS_FAIL, 
                msg: res?.data?.msg 
            });
        }
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_BRANDS_FAIL, 
            msg: error.message 
        });
    }
};

export const getBrandDetail = (brandId) => async (dispatch) => {
    try {
        const res = await apiGetBrandDetail(brandId);

        if (res?.data?.err === 0) {
            dispatch({
                type: actionTypes.GET_BRAND_DETAIL_SUCCESS,
                brand: res.data.brand
            });
        } else {
            dispatch({
                type: actionTypes.GET_BRAND_DETAIL_FAIL,
                msg: res?.data?.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_BRAND_DETAIL_FAIL,
            msg: error.message
        });
    }
};

export const getAllBrandsAdmin = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetAllBrandsAdmin(params);

        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_BRANDS_SUCCESS,
                adminBrandList: res.brands   // admin trả về brands (pagination)
            });
        } else {
            dispatch({
                type: actionTypes.GET_BRANDS_FAIL,
                msg: res?.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_BRANDS_FAIL,
            msg: error.message
        });
    }
};