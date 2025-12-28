import actionTypes from '../actions/actionTypes';

const initialState = {
    orders: null,
    error: null,
    currentOrder: null,
    adminOrderList: null,
}

const orderReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_MY_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.response || null,
                error: null
            }
        case actionTypes.GET_MY_ORDERS_FAIL:
            return { ...state, error: action.msg };

        case actionTypes.GET_ALL_ORDERS_ADMIN_SUCCESS:
            return {
                ...state,
                adminOrderList: action.response,
            };

        case actionTypes.GET_ORDER_DETAIL_ADMIN_SUCCESS:
            return {
                ...state,
                currentOrder: action.order,
            };

        case actionTypes.CONFIRM_ORDER_ADMIN_SUCCESS:
            return {
                ...state,
                // Cập nhật currentOrder nếu đang xem đúng đơn đó
                currentOrder: action.response.order
                    ? { ...state.currentOrder, ...action.response.order }
                    : state.currentOrder,
                // Danh sách sẽ được reload tự động bởi action getAllOrdersAdmin()
            };

        case actionTypes.CONFIRM_ORDER_ADMIN_FAIL:
            // Không lưu lỗi vào state vì bạn không muốn
            return state;
        default:
            return state;
    }
}

export default orderReducer;
