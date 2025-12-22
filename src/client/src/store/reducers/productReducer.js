import actionTypes from '../actions/actionTypes';

const initialState = {
    products: [],            // Danh sách sản phẩm khi lấy nhiều sản phẩm
    resultCount: null,       // Tổng số sản phẩm trả về từ API
    page: null,              // Trang hiện tại (pagination)
    limit: null,             // Số lượng sản phẩm trên mỗi trang
    error: null,             // Lỗi khi lấy danh sách sản phẩm hoặc chi tiết sản phẩm
    product: null,           // Chi tiết sản phẩm hiện tại
    reviews: [],             // Danh sách review của sản phẩm
    avgRating: "0.0",        // Điểm đánh giá trung bình
    totalReviews: 0,         // Tổng số bài review
    reviewError: null,       // Lỗi khi lấy review,
    adminProductList: null,  // null ban đầu, khi gọi API admin sẽ là object từ response
    adminLoading: false,     // Optional: để show loading trong admin
    adminError: null,        // Lỗi riêng cho phần admin
}

const productReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.response.data || [],
                resultCount: action.response.total || 0,
                page: action.response.page ?? null,
                limit: action.response.limit ?? null,
                error: null
            }
        case actionTypes.GET_PRODUCTS_FAIL:
            return { ...state, error: action.msg };
        case actionTypes.GET_PRODUCT_DETAIL_SUCCESS:
            return { ...state, product: action.response, error: null };
        case actionTypes.GET_PRODUCT_DETAIL_FAIL:
            return { ...state, product: null, error: action.msg };
        case actionTypes.GET_PRODUCT_REVIEWS_SUCCESS:
            return {
                ...state,
                reviews: action.response.reviews || [],
                avgRating: action.response.averagaRating || "0.0",
                totalReviews: action.response.totalReviews || 0,
                reviewError: null,
            };
        case actionTypes.GET_PRODUCT_REVIEWS_FAIL:
            return {
                ...state,
                reviews: [],
                avgRating: "0.0",
                totalReviews: 0,
                reviewError: action.msg,
            };
        case 'GET_ADMIN_PRODUCTS_SUCCESS':
            return {
                ...state,
                adminLoading: false,
                adminProductList: action.payload, // payload = res.products từ API
                adminError: null,
            };

        case 'GET_ADMIN_PRODUCTS_FAIL':
            return {
                ...state,
                adminLoading: false,
                adminProductList: null,
                adminError: action.msg,
            };
        default:
            return state;
    }
}

export default productReducer;