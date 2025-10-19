import actionTypes from "../actions/actionTypes";

const initState = {
    user: null,
    msg:'',
    update:false
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_CURRENT_USER_SUCCESS:
            return {
                ...state,
                user: action.currentUserData.user || null,
                msg: action.currentUserData.msg || '',
            }
        case actionTypes.GET_CURRENT_USER_FAIL:
            return {
                ...state,
                user: null,
                msg: action.msg || 'Failed to get current user',
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                user: null,
                msg:'',
                update:false,
            }
        default:
            return state;
    }
}

export default userReducer
