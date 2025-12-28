import actionTypes from './actionTypes';
import { apigetMyOrders , apiGetAllOrdersAdmin, apiGetOrderDetailAdmin, apiConfirmOrderAdmin} from '../../api/order';

export const getMyOrders = (params = {}) => async (dispatch) => {
    try {
        const res = await apigetMyOrders(params);
        console.log('apigetMyOrders: ', res)
        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_MY_ORDERS_SUCCESS,
                response: res.response,
            });
        } else {
            dispatch({
                type: actionTypes.GET_MY_ORDERS_FAIL,
                msg: res?.msg,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_MY_ORDERS_FAIL,
            msg: error.message,
        });
    }
};

// Lấy tất cả đơn hàng (Admin)
export const getAllOrdersAdmin = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.GET_ALL_ORDERS_ADMIN_REQUEST });

        const res = await apiGetAllOrdersAdmin(params);

        if (res?.err === 0 || res?.total !== undefined) { // formatPaginatedResponse
            dispatch({
                type: actionTypes.GET_ALL_ORDERS_ADMIN_SUCCESS,
                response: res // có total, page, data
            });
        } else {
            dispatch({
                type: actionTypes.GET_ALL_ORDERS_ADMIN_FAIL,
                msg: res?.msg || 'Lấy danh sách đơn hàng thất bại'
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_ALL_ORDERS_ADMIN_FAIL,
            msg: error?.msg || 'Lỗi kết nối server'
        });
    }
};

// Xem chi tiết đơn hàng (Admin)
export const getOrderDetailAdmin = (orderId) => async (dispatch) => {
    try {
        const res = await apiGetOrderDetailAdmin(orderId);

        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_ORDER_DETAIL_ADMIN_SUCCESS,
                order: res.order
            });
        } else {
            dispatch({
                type: actionTypes.GET_ORDER_DETAIL_ADMIN_FAIL,
                msg: res?.msg || 'Không tìm thấy đơn hàng'
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_ORDER_DETAIL_ADMIN_FAIL,
            msg: error?.msg || 'Lỗi server'
        });
    }
};

// Cập nhật trạng thái đơn hàng (Admin)
export const confirmOrderAdmin = (orderId, currentParams = {}) => async (dispatch) => {
    try {
        const res = await apiConfirmOrderAdmin(orderId);

        if (res?.err === 0) {
            dispatch({
                type: actionTypes.CONFIRM_ORDER_ADMIN_SUCCESS,
                response: res,
            });
            // Reload danh sách để thấy trạng thái mới
            dispatch(getAllOrdersAdmin(currentParams));
        } else {
            dispatch({
                type: actionTypes.CONFIRM_ORDER_ADMIN_FAIL,
                msg: res?.msg || 'Xác nhận đơn hàng thất bại'
            });
        }
        return res;
    } catch (error) {
        dispatch({
            type: actionTypes.CONFIRM_ORDER_ADMIN_FAIL,
            msg: error?.msg || 'Lỗi kết nối server'
        });
    }
};