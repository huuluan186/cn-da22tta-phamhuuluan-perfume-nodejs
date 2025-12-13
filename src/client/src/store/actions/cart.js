import actionTypes from './actionTypes'
import { apiGetMyCart, apiAddToCart } from '../../api/cart'

export const getMyCart = () => async (dispatch) => {
    try {
        const res = await apiGetMyCart();    
        if(res?.err === 0 ){
            dispatch({ 
                type: actionTypes.GET_MY_CART_SUCCESS, 
                data: res.response
            });
        } else {
            dispatch({ 
                type: actionTypes.GET_MY_CART_FAIL, 
                msg: res?.msg 
            });
        }   
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_MY_CART_FAIL,  
            msg: error.message 
        });
    }
};

export const addToCart = (productVariantId, quantity) => async (dispatch) => {
    try {
        const res = await apiAddToCart(productVariantId, quantity);
        if(res?.err === 0) {
            dispatch({
                type: actionTypes.ADD_TO_CART_SUCCESS,
                data: res.response
            });
        } else {
            dispatch({
                type: actionTypes.ADD_TO_CART_FAIL,
                msg: res?.msg
            });
        }
        return res;
    } catch (error) {
        dispatch({
            type: actionTypes.ADD_TO_CART_FAIL,
            msg: error.message
        });
        return { err: 1, msg: error.message };
    }
};

