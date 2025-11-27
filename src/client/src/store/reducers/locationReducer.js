import actionTypes from "../actions/actionTypes";

const initialState = {
    countries: [],
    provinces: [],
    wards: [],
    //loading: false,
    error: null,
};

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_COUNTRIES_REQUEST:
            return { 
                ...state, 
                //loading: true, 
                error: null 
            };

        case actionTypes.GET_COUNTRIES_SUCCESS:
            return { 
                ...state, 
                //loading: false, 
                countries: action.payload 
            };

        case actionTypes.GET_COUNTRIES_FAIL:
            return { 
                ...state, 
                //loading: false, 
                error: action.payload 
            };

        case actionTypes.GET_PROVINCES_SUCCESS:
            return { ...state, provinces: action.payload };

        case actionTypes.GET_WARDS_SUCCESS:
            return { ...state, wards: action.payload };
        default:
            return state;
    }
};

export default locationReducer;
