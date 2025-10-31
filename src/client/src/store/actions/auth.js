import actionTypes from './actionTypes'
import { apiLogin, apiLogout } from '../../api/auth' 
import { getCurrentUser } from './user';

export const login = (payload) => async (dispatch) => {
    dispatch({ type: actionTypes.LOGIN_REQUEST }); // reset msg cũ
    try {
        const response = await apiLogin(payload);
        console.log("response action login: ",response);
        if(response?.data.err===0){
            // Sau khi login, cookie HttpOnly đã được set
            // Chỉ fetch user info từ backend
            await dispatch(getCurrentUser());
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response.data.msg,
            });
        }else{
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response?.data?.msg || 'Login failed'
            })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: error.response?.data?.msg
        })
    }
}

export const logout = () => async (dispatch) => {
    try {
        await apiLogout(); // server clear cookie
        dispatch({ type: actionTypes.LOGOUT })
        window.location.href = '/';    
    } catch (error) {
        console.warn("Logout API failed:", error.message);
    }
};
