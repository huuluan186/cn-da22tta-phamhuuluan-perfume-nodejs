import actionTypes from '../actions/actionTypes';

const initialState = {
    coupons: {
        total: 0,
        page: null,
        limit: null,
        data: []
    },
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

        default:
            return state;
    }
};

export default couponReducer;
