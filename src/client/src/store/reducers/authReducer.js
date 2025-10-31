import actionTypes from "../actions/actionTypes";

const initState = {
    msg:'',
    errorToggle: false
}

const authReducer = (state=initState,action)=>{
    switch(action.type){
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                msg: action.data || '',
                //errorToggle: false
            };
        case actionTypes.LOGIN_FAIL:
            return{
                ...state,
                msg: action.data || 'Login failed',
                errorToggle:!state.errorToggle
            };
        case actionTypes.LOGIN_REQUEST: // **thêm để reset msg cũ**
            return {
                ...state,
                msg: ''
            }
        case actionTypes.LOGOUT:
            console.log(">>> RESET authReducer khi logout");
            return {...initState};
        default:
            return state;
    }
}

export default authReducer;