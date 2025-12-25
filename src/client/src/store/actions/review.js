import actionTypes from './actionTypes';
import { apiGetReviewsAdmin, apiReviewDetailAdmin } from '../../api/review';

export const getAllReviewsAdmin = (params = {}) => async (dispatch) => {
    try {

        const res = await apiGetReviewsAdmin(params);

        if (res?.err === 0) { 
            dispatch({
                type: actionTypes.GET_ALL_REVIEWS_ADMIN_SUCCESS,
                response: res.reviews // có total, page, data
            });
        } else {
            dispatch({
                type: actionTypes.GET_ALL_REVIEWS_ADMIN_FAIL,
                msg: res?.msg || 'Lấy danh sách đánh giá thất bại'
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_ALL_ORDERS_ADMIN_FAIL,
            msg: error?.msg || 'Lỗi kết nối server'
        });
    }
};

// Lấy chi tiết một review
export const getReviewDetailAdmin = (reviewId) => async (dispatch) => {
    try {
        const res = await apiReviewDetailAdmin(reviewId);

        if (res?.err === 0) {
            dispatch({
                type: actionTypes.GET_REVIEW_DETAIL_ADMIN_SUCCESS,
                review: res.review
            });
        } else {
            dispatch({
                type: actionTypes.GET_REVIEW_DETAIL_ADMIN_FAIL,
                msg: res?.msg || 'Không tìm thấy đánh giá'
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_REVIEW_DETAIL_ADMIN_FAIL,
            msg: error?.response?.data?.msg || 'Lỗi kết nối server'
        });
    }
};