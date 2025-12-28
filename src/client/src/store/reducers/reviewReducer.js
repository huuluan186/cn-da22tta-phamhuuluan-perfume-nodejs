import actionTypes from '../actions/actionTypes';

const initialState = {
    error: null,
    adminReviewList: null,
    currentReview: null,
}

const reviewReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_ALL_REVIEWS_ADMIN_SUCCESS:
            return {
                ...state,
                adminReviewList: action.response,
                error: null
            };
        case actionTypes.GET_ALL_REVIEWS_ADMIN_FAIL:
            return {
                ...state,
                error: action.msg
            };

        case actionTypes.GET_REVIEW_DETAIL_ADMIN_SUCCESS:
            return {
                ...state,
                currentReview: action.review,
                error: null
            };

        case actionTypes.GET_REVIEW_DETAIL_ADMIN_FAIL:
            return {
                ...state,
                currentReview: null,
                error: action.msg
            };
        default:
            return state;
    }
}

export default reviewReducer;
