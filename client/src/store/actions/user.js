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
        }else {
            // Lỗi từ server (như user không tồn tại hoặc token hết hạn)
            dispatch({
                type: actionTypes.GET_CURRENT_USER_FAIL,
                currentUserData: null,
                msg: response?.data?.msg || 'Failed to get user'
            });
            if (response?.data?.msg?.includes('expired')) {
                dispatch(logout());
            }
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CURRENT_USER_FAIL,
            currentUserData: null,
            msg: error.message
        })
        //Khi token hết hạn thì sẽ logout
        if (error.response?.data?.err === 1 && error.response?.data?.msg?.includes('expired')) {
            dispatch(logout());
        }
    }
};