import actionTypes from './actionTypes'
import { apiGetMyCoupons } from '../../api/coupon'

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