import actionTypes from '../actions/actionTypes';

const initialState = {
    categories: [],
    adminCategoryList: null,
    categoryDetail: null,
    error: null
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.categories ?? state.categories,
                adminCategoryList: action.adminCategoryList ?? state.adminCategoryList,
                error: null
            };

        case actionTypes.GET_CATEGORY_DETAIL_SUCCESS:
            return {
                ...state,
                categoryDetail: action.category
            };

        case actionTypes.GET_CATEGORIES_FAIL:
        case actionTypes.GET_CATEGORY_DETAIL_FAIL:
            return {
                ...state,
                error: action.msg
            };

        default:
            return state;
    }
};

export default categoryReducer;
