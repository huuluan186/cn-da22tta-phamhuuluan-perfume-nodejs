import actionTypes from './actionTypes'
import { apiGetAllCategories, apiGetAllCategoriesAdmin, apiGetCategoryDetail } from '../../api/category'

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

export const getCategoryDetail = (categoryId) => async (dispatch) => {
    try {
        const res = await apiGetCategoryDetail(categoryId);

        if (res?.data?.err === 0) {
            dispatch({
                type: actionTypes.GET_CATEGORY_DETAIL_SUCCESS,
                brand: res.data.category
            });
        } else {
            dispatch({
                type: actionTypes.GET_CATEGORY_DETAIL_FAIL,
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

/**
 * ADMIN
 */
export const getAllCategoriesAdmin = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetAllCategoriesAdmin(params);

        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_CATEGORIES_SUCCESS,
                adminCategoryList: res.categories // pagination
            });
        } else {
            dispatch({
                type: actionTypes.GET_CATEGORIES_FAIL,
                msg: res?.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CATEGORIES_FAIL,
            msg: error.message
        });
    }
};