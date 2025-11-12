import actionTypes from './actionTypes';
import { apiGetProductsList } from '../../api/product';

export const getProductsList = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetProductsList(params);
        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_PRODUCTS_SUCCESS,
                response: res.response,
            });
        } else {
            dispatch({
                type: actionTypes.GET_PRODUCTS_FAIL,
                msg: res?.msg,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_PRODUCTS_FAIL,
            msg: error.message,
        });
    }
};
