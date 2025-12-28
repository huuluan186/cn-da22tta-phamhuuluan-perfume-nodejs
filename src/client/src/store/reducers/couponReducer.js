import actionTypes from '../actions/actionTypes';

const initialState = {
    coupons: {
        total: 0,
        page: null,
        limit: null,
        data: []
    },
    adminCouponList: null,
    msg: '',
};

const couponReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_MY_COUPONS_SUCCESS:
            return {
                ...state,
                coupons: action.coupons,
                msg: '',
            };

        case actionTypes.GET_MY_COUPONS_FAIL:
            return {
                ...state,
                coupons: initialState.coupons,
                msg: action.msg
            };

        case actionTypes.GET_ALL_COUPONS_ADMIN_SUCCESS:
            return {
                ...state,
                adminCouponList: action.adminCouponList
            };

        case actionTypes.GET_ALL_ORDERS_ADMIN_FAIL:
            return {
                ...state,
            };

        default:
            return state;
    }
};

export default couponReducer;
