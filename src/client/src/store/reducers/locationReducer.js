import actionTypes from "../actions/actionTypes";

const initialState = {
    provinces: [],
    wards: [],
    //loading: false,
    error: null,
};

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_PROVINCES_SUCCESS:
            return { ...state, provinces: action.payload };

        case actionTypes.GET_WARDS_SUCCESS:
            return { ...state, wards: action.payload };
        default:
            return state;
    }
};

export default locationReducer;
