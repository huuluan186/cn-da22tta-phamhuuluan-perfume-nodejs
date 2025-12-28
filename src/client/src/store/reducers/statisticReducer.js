import actionTypes from '../actions/actionTypes';

const initialState = {
    kpis: null,
    revenueTrend: [],
    topProducts: [],
    revenueByCategory: [],
    revenueByBrand: [],
    revenueByPayment: [],
    topCustomers: [],
    loading: false,
    error: null,
};

const statisticReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_STATISTICS_KPIS_SUCCESS:
            return { ...state, kpis: action.payload };
        case actionTypes.GET_STATISTICS_REVENUE_TREND_SUCCESS:
            return { ...state, revenueTrend: action.payload };
        case actionTypes.GET_STATISTICS_TOP_PRODUCTS_SUCCESS:
            return { ...state, topProducts: action.payload };
        case actionTypes.GET_STATISTICS_BY_CATEGORY_SUCCESS:
            return { ...state, revenueByCategory: action.payload };
        case actionTypes.GET_STATISTICS_BY_BRAND_SUCCESS:
            return { ...state, revenueByBrand: action.payload };
        case actionTypes.GET_STATISTICS_BY_PAYMENT_SUCCESS:
            return { ...state, revenueByPayment: action.payload };
        case actionTypes.GET_STATISTICS_TOP_CUSTOMERS_SUCCESS:
            return { ...state, topCustomers: action.payload };
        case actionTypes.STATISTICS_FAIL:
            return { ...state, error: action.msg || 'Lỗi tải dữ liệu thống kê' };
        default:
            return state;
    }
};

export default statisticReducer;