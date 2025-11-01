import actionTypes from "../actions/actionTypes";

const initState = {
    user: null,
    msg:'',
    update:false,
    loading: true, //để chờ fetch user khi reload trang
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_CURRENT_USER_SUCCESS:
            return {
                ...state,
                user: action.currentUserData?.user || null,
                msg: action.currentUserData?.msg || '',
                loading: false
            }
        case actionTypes.GET_CURRENT_USER_FAIL:
            return {
                ...state,
                user: action.currentUserData?.user || null,
                msg: action.msg || 'Failed to get current user',
                loading: false
            }
        case actionTypes.UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                user: action.currentUserData.user || state.user, 
                msg: action.currentUserData.msg || 'Cập nhật thành công',
                update: true, 
                loading: false
            };
        case actionTypes.UPDATE_USER_PROFILE_FAIL:
            return {
                ...state,
                msg: action.msg || 'Cập nhật thất bại',
                update: false,
                loading: false
            };
        case actionTypes.LOGOUT:
            return { ...initState, loading: false };
        default:
            return state;
    }
}

export default userReducer
