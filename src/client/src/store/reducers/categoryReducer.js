import actionTypes from '../actions/actionTypes';

const initialState = {
    categories: [],
    error: null
};

const categoryReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_CATEGORIES_SUCCESS:
            return { ...state, categories: action.categories };
        case actionTypes.GET_CATEGORIES_FAIL:
            return { ...state, error: action.msg };
        default:
            return state;
    }
};

export default categoryReducer;
