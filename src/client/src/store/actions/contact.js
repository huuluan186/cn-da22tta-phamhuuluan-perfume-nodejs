import actionTypes from './actionTypes';
import { apiGetAllContacts, apiGetContactDetail } from '../../api/contact';

// Lấy danh sách contacts (Admin)
export const getAllContactsAdmin = (query = {}) => async (dispatch) => {
    try {
        const res = await apiGetAllContacts(query);
        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_ALL_CONTACTS_ADMIN_SUCCESS,
                data: res.response
            });
        } else {
            dispatch({
                type: actionTypes.GET_ALL_CONTACTS_ADMIN_FAIL,
                msg: res?.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_ALL_CONTACTS_ADMIN_FAIL,
            msg: error.message
        });
    }
};

// Lấy chi tiết contact (Admin)
export const getContactDetailAdmin = (contactId) => async (dispatch) => {
    try {
        const res = await apiGetContactDetail(contactId);
        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_CONTACT_DETAIL_ADMIN_SUCCESS,
                data: res.response
            });
        } else {
            dispatch({
                type: actionTypes.GET_CONTACT_DETAIL_ADMIN_FAIL,
                msg: res?.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CONTACT_DETAIL_ADMIN_FAIL,
            msg: error.message
        });
    }
};
