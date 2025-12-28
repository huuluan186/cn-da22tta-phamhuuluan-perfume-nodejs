import actionTypes from './actionTypes'
import { apiGetMyCoupons, apiGetAllCouponsAdmin } from '../../api/coupon'

export const getMyCoupons = () => async (dispatch) => {
    try {
        const res = await apiGetMyCoupons();    
        if(res?.err === 0 ){
            dispatch({ 
                type: actionTypes.GET_MY_COUPONS_SUCCESS, 
                coupons: res.response
            });
        } else {
            dispatch({ 
                type: actionTypes.GET_MY_COUPONS_FAIL, 
                msg: res?.msg 
            });
        }   
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_MY_COUPONS_FAIL,  
            msg: error.message 
        });
    }
};

export const getAllCouponsAdmin = (params = {}) => async (dispatch) => {
    try {

        const res = await apiGetAllCouponsAdmin(params); 

        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_ALL_COUPONS_ADMIN_SUCCESS,
                adminCouponList: res.response 
            });
        } else {
            dispatch({
                type: actionTypes.GET_ALL_COUPONS_ADMIN_FAIL,
                msg: res?.msg || 'Lấy danh sách coupon thất bại'
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_ALL_COUPONS_ADMIN_FAIL,
            msg: error.message || 'Lỗi kết nối server'
        });
    }
};