import actionTypes from '../actions/actionTypes';

const initialState = {
    orders: null,
    error: null,
}

const orderReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_MY_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.response || null,
                error: null
            }
        case actionTypes.GET_MY_ORDERS_FAIL:
            return { ...state, error: action.msg };
        default:
            return state;
    }
}

export default orderReducer;
