import actionTypes from './actionTypes'
import { apiGetAllCategories } from '../../api/category'

export const getAllCategories = () => async (dispatch) => {
    try {
        const res = await apiGetAllCategories();
        if(res?.data?.err === 0 ){
            dispatch({ 
                type: actionTypes.GET_CATEGORIES_SUCCESS, 
                categories: res.data.response
            });
        } else {
            dispatch({ 
                type: actionTypes.GET_CATEGORIES_FAIL, 
                msg: res?.data?.msg 
            });
        }
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_CATEGORIES_FAIL, 
            msg: error.message 
        });
    }
};
