import actionTypes from './actionTypes'
import { apiGetCurrentUser } from '../../api/user'
import { logout } from './auth';

export const getCurrentUser = () => async (dispatch) => {
    try {
        const response = await apiGetCurrentUser();
        console.log("response action get current user: ",response);
        if(response?.data?.err === 0){
            dispatch({
                type: actionTypes.GET_CURRENT_USER_SUCCESS,
                currentUserData: response.data
            })
        }else dispatch(logout())
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CURRENT_USER_SUCCESS,
            currentUserData: null,
            msg: error
        })
        //Khi token hết hạn thì sẽ logout
        if (error.err === 1 && error.msg.includes('expired')) {
            dispatch(logout());
        }
    }
};