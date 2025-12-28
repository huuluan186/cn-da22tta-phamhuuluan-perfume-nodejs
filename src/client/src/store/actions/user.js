import actionTypes from './actionTypes'
import { apiGetCurrentUser, apiGetAllUsers } from '../../api/user'
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
        } else {
            // Lỗi từ server (như user không tồn tại hoặc token hết hạn)
            dispatch({
                type: actionTypes.GET_CURRENT_USER_FAIL,
                currentUserData: null,
                //msg: response?.data?.msg || 'Failed to get user'
            });
            if (response?.data?.msg?.includes('expired')) {
                dispatch(logout());
            }
        }
        return response?.data;
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CURRENT_USER_FAIL,
            currentUserData: null,
            //msg: error.message
        })
        //Khi token hết hạn thì sẽ logout
        if (error.response?.data?.err === 1 && error.response?.data?.msg?.includes('expired')) {
            dispatch(logout());
        }
        return { data: { err: 1, msg: 'Lỗi khi lấy thông tin người dùng' } };
    }
};

// ================= GET USERS =================
export const getAllUsers = (params = {}) => async (dispatch) => {
    try {
        const response = await apiGetAllUsers(params);

        if (response?.data?.err === 0) {
            dispatch({
                type: actionTypes.GET_USERS_SUCCESS,
                users: response.data.response
            });
        } else {
            dispatch({
                type: actionTypes.GET_USERS_FAIL,
                msg: response?.data?.msg
            });
        }

        return response?.data;
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: actionTypes.GET_USERS_FAIL,
            msg: 'Failed to get users'
        });
    }
};
