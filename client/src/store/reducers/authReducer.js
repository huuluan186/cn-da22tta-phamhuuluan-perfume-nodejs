import actionTypes from "../actions/actionTypes";

const initState = {
    isLoggedIn:false,
    token:null,
    msg:'',
    isAdmin: null,
    errorToggle: false
}

const authReducer = (state=initState,action)=>{
    switch(action.type){
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,  // Chỉ đăng nhập thành công mới là true
                token: action.data.token,
                isAdmin: action.data.isAdmin,
                msg: action.data.msg,
            };
        case actionTypes.LOGIN_FAIL:
            return{
                ...state,
                isLoggedIn: false,
                msg: action.data,
                token:null,
                isAdmin:null,
                errorToggle:!state.errorToggle
            };
        case actionTypes.LOGOUT:
            return{
                ...state,
                isLoggedIn:false,
                msg:'',
                isAdmin:null,
                token:null
            };
        default:
            return state;
    }
}

export default authReducer;