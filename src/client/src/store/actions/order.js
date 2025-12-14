import actionTypes from './actionTypes';
import { apigetMyOrders } from '../../api/order';

export const getMyOrders = () => async (dispatch) => {
    try {
        const res = await apigetMyOrders();
        console.log('apigetMyOrders: ', res)
        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_MY_ORDERS_SUCCESS,
                response: res.response,
            });
        } else {
            dispatch({
                type: actionTypes.GET_MY_ORDERS_FAIL,
                msg: res?.msg,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_MY_ORDERS_FAIL,
            msg: error.message,
        });
    }
};
