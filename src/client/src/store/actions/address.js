import actionTypes from './actionTypes'
import { apiGetMyAddress } from '../../api/user';

// =================== ADDRESSES LIST ====================== //
export const getMyAddresses = () => async (dispatch) => {
    dispatch({ type: actionTypes.GET_MY_ADDRESSES_REQUEST });
    try {
        const response = await apiGetMyAddress();
        console.log("response action get my addresses: ", response);
        if (response?.data?.err === 0) {
            dispatch({
                type: actionTypes.GET_MY_ADDRESSES_SUCCESS,
                addresses: response.data.response || { count: 0, rows: [] },
            });
        } else {
            dispatch({
                type: actionTypes.GET_MY_ADDRESSES_FAIL,
                msg: response?.data?.msg || 'Không thể lấy danh sách địa chỉ',
            });
        }

        //return response?.data;
    } catch (error) {
        dispatch({
            type: actionTypes.GET_MY_ADDRESSES_FAIL,
            msg: error.message || 'Lỗi khi lấy danh sách địa chỉ',
        });
        //return { data: { err: 1, msg: 'Lỗi khi lấy danh sách địa chỉ' } };
    }
};

