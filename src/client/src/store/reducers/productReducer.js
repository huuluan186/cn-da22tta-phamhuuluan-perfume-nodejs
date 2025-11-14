import actionTypes from '../actions/actionTypes';

const initialState = {
    products: [],
    resultCount: null,
    page: null,
    limit: null,
    error: null
}

const productReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.response.data || [],
                resultCount: action.response.total || 0,
                page: action.response.page ?? null,
                limit: action.response.limit ?? null,
                error: null
            }
        case actionTypes.GET_PRODUCTS_FAIL:
            return { ...state, error: action.msg };
        default:
            return state;
    }
}

export default productReducer;