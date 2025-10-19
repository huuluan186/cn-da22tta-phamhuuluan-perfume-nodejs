import actionTypes from './actionTypes'
import { apiLogin } from '../../api/auth' 
import { jwtDecode } from 'jwt-decode'

export const loginSuccess = (payload) => ({
    type: actionTypes.LOGIN_SUCCESS,
    data: {
        token: payload.token,
        isAdmin: jwtDecode(payload.token).isAdmin,
        msg: payload.msg,
    },
});

export const login = (payload) => async (dispatch) => {
    try {
        const response = await apiLogin(payload);
        console.log("response action login: ",response);
        if(response?.data.err===0){
            const token = response.data.token;
            const msg = response.data.msg
            localStorage.setItem('token', token);
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: {
                    token,
                    isAdmin: jwtDecode(token).isAdmin,
                    msg,
                }
            }) 
        }else{
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response.data.msg
            })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: error.response?.data?.msg
        })
    }
}

export const logout = () => {
    localStorage.removeItem('token'); //xóa token khi logout
    return {
        type: actionTypes.LOGOUT
    };
};
