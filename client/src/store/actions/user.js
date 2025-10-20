import actionTypes from './actionTypes'
import { apiGetCurrentUser, apiUpdateCurrentUser } from '../../api/user'
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

export const updateUserProfile = (data) => async (dispatch) => {
    try {
        const response = await apiUpdateCurrentUser(data);
        console.log("response action update user profile: ", response);
        if(response?.data?.err === 0){
            dispatch({
                type: actionTypes.UPDATE_USER_PROFILE_SUCCESS,
                currentUserData: response.data,
            });
            // Tự động lấy lại thông tin người dùng mới nhất (tùy chọn)
            dispatch(getCurrentUser());
        }else {
            dispatch({
                type: actionTypes.UPDATE_USER_PROFILE_FAIL,
                msg: response?.data?.msg || 'Failed to update user profile',
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.UPDATE_USER_PROFILE_FAIL,
            msg: error.message || 'Error updating user profile',
        });
    }
}