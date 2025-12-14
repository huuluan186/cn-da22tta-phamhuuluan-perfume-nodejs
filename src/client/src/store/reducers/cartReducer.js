import actionTypes from '../actions/actionTypes';

const initialState = {
    cart: null,
    msg: '',
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_MY_CART_SUCCESS:
        case actionTypes.ADD_TO_CART_SUCCESS:
            return {
                ...state,
                cart: action.data, // lưu toàn bộ cart
                msg: '',
            };

        case actionTypes.GET_MY_CART_FAIL:
        case actionTypes.ADD_TO_CART_FAIL:
            return {
                ...state,
                cart: null,
                msg: action.msg
            };

        default:
            return state;
    }
};

export default cartReducer;
