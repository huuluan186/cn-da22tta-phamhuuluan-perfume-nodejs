import actionTypes from './actionTypes';
import {
    apiGetKPIs,
    apiGetRevenueTrend,
    apiGetTopProducts,
    apiGetRevenueByCategory,
    apiGetRevenueByBrand,
    apiGetRevenueByPayment,
    apiGetTopCustomers
} from '../../api/statistic';

export const getKPIs = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetKPIs(params);

        if (res && res.err === 0) {
            dispatch({
                type: actionTypes.GET_STATISTICS_KPIS_SUCCESS,
                payload: res.response
            });
        } else {
            dispatch({
                type: actionTypes.STATISTICS_FAIL,
                msg: res?.msg || 'Không lấy được KPIs'
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.STATISTICS_FAIL,
            msg: error?.response?.data?.msg || error.message || 'Lỗi server KPIs'
        });
    }
};


export const getRevenueTrend = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetRevenueTrend(params);
        if (res?.err === 0) {
            dispatch({ type: actionTypes.GET_STATISTICS_REVENUE_TREND_SUCCESS, payload: res.response });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.STATISTICS_FAIL,
            msg: error?.response?.data?.msg || error.message || 'Lỗi server KPIs'
        });
    }
};

export const getTopProducts = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetTopProducts(params);
        if (res?.err === 0) {
            dispatch({ type: actionTypes.GET_STATISTICS_TOP_PRODUCTS_SUCCESS, payload: res.response });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.STATISTICS_FAIL,
            msg: error?.response?.data?.msg || error.message || 'Lỗi server KPIs'
        });
    }
};

export const getRevenueByCategory = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetRevenueByCategory(params);
        if (res?.err === 0) {
            dispatch({ type: actionTypes.GET_STATISTICS_BY_CATEGORY_SUCCESS, payload: res.response });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.STATISTICS_FAIL,
            msg: error?.response?.data?.msg || error.message || 'Lỗi server KPIs'
        });
    }
};

export const getRevenueByBrand = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetRevenueByBrand(params);
        if (res?.err === 0) {
            dispatch({ type: actionTypes.GET_STATISTICS_BY_BRAND_SUCCESS, payload: res.response });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.STATISTICS_FAIL,
            msg: error?.response?.data?.msg || error.message || 'Lỗi server KPIs'
        });
    }
};

export const getRevenueByPayment = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetRevenueByPayment(params);
        if (res?.err === 0) {
            dispatch({ type: actionTypes.GET_STATISTICS_BY_PAYMENT_SUCCESS, payload: res.response });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.STATISTICS_FAIL,
            msg: error?.response?.data?.msg || error.message || 'Lỗi server KPIs'
        });
    }
};

export const getTopCustomers = (params = {}) => async (dispatch) => {
    try {
        const res = await apiGetTopCustomers(params);
        if (res?.err === 0) {
            dispatch({ type: actionTypes.GET_STATISTICS_TOP_CUSTOMERS_SUCCESS, payload: res.response });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.STATISTICS_FAIL,
            msg: error?.response?.data?.msg || error.message || 'Lỗi server KPIs'
        });
    }
};