import actionTypes from './actionTypes';
import { apiGetProductsList, apiGetProductDetail, apiGetProductReviews } from '../../api/product';

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

export const getProductDetail = (productId) => async (dispatch) => {
    try {
        const res = await apiGetProductDetail(productId);
        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_PRODUCT_DETAIL_SUCCESS,
                response: res.response,
            });
        } else {
            dispatch({
                type: actionTypes.GET_PRODUCT_DETAIL_FAIL,
                msg: res?.msg,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_PRODUCT_DETAIL_FAIL,
            msg: error.message,
        });
    }
};

export const getProductReviews = (productId) => async (dispatch) => {
    try {
        const res = await apiGetProductReviews(productId);
        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_PRODUCT_REVIEWS_SUCCESS,
                response: res.response,
            });
        } else {
            dispatch({
                type: actionTypes.GET_PRODUCT_REVIEWS_FAIL,
                msg: res?.msg,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_PRODUCT_REVIEWS_FAIL,
            msg: error.message,
        });
    }
};
