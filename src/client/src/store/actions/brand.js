import actionTypes from './actionTypes'
import { apiGetAllBrands } from '../../api/brand'

export const getAllBrands = () => async (dispatch) => {
    try {
        const res = await apiGetAllBrands();
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
