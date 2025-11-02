import actionTypes from '../actions/actionTypes';

const initialState = {
    addresses: {
        count: 0,
        rows: []
    },
    error: null,
};

const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_MY_ADDRESSES_REQUEST:
            return { ...state, error: null };

        case actionTypes.GET_MY_ADDRESSES_SUCCESS:
            return { ...state, addresses: action.addresses };

        case actionTypes.GET_MY_ADDRESSES_FAIL:
            return { ...state, error: action.msg };
        default:
            return state;
    }
};

export default addressReducer;
