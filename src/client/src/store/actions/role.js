import actionTypes from './actionTypes';
import { apiGetAllRoles } from '../../api/role';

export const getAllRoles = () => async (dispatch) => {
    try {
        const response = await apiGetAllRoles(); 

        if (response?.err === 0) {
            dispatch({
                type: actionTypes.GET_ROLES_SUCCESS,
                roles: response.response,
            });
        } else {
            dispatch({
                type: actionTypes.GET_ROLES_FAIL,
                msg: response?.msg,
            });
        }

        return response;
    } catch (error) {
        dispatch({
            type: actionTypes.GET_ROLES_FAIL,
            msg: 'Failed to get roles',
        });
    }
};
