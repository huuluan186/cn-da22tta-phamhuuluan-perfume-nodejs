import actionTypes from '../actions/actionTypes';

const initialState = {
    brands: [],
    adminBrandList: null,
    brandDetail: null,
    error: null
};

const brandReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_BRANDS_SUCCESS:
            return {
                ...state,
                brands: action.brands ?? state.brands,
                adminBrandList: action.adminBrandList ?? state.adminBrandList,
                error: null
            };

        case actionTypes.GET_BRAND_DETAIL_SUCCESS:
            return { ...state, brandDetail: action.brand };

        case actionTypes.GET_BRANDS_FAIL:
        case actionTypes.GET_BRAND_DETAIL_FAIL:
            return { ...state, error: action.msg };
            
        default:
            return state;
    }
};

export default brandReducer;
