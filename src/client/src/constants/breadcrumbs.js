import { path } from "./path";

export const breadcrumbMap = {
    [path.HOME]: [{ label: "Trang chủ", link: path.HOME }],

    [path.LOGIN]: [
        { label: "Đăng nhập tài khoản" }
    ],

    [path.REGISTER]: [
        { label: "Đăng ký tài khoản" }
    ],

    [path.ACCOUNT]: [
        { label: "Trang khách hàng" }
    ],

    [path.RESET_PASSWORD]: [
        { label: "Đặt lại mật khẩu" }
    ],

    [`${path.ACCOUNT}/${path.CHANGE_PASSWORD}`]: [
        { label: "Tài khoản", link: path.ACCOUNT },
        { label: "Thay đổi mật khẩu" },
    ],

    [`${path.ACCOUNT}/${path.ADDRESSES}`]: [
        { label: "Tài khoản", link: path.ACCOUNT },
        { label: "Sổ địa chỉ" },
    ],

    [`${path.COLLECTIONS}/${path.ALL_PRODUCTS}`]: [
        { label: "Tất cả sản phẩm" },
    ],

    [`${path.COLLECTIONS}/:slug`]: [
        { label: "Danh mục" },
    ],

    [`${path.BRANDS}`]: [
        { label: "Thương hiệu" },
    ],

    [`${path.PRODUCT_DETAIL}`]: [
        { label: "" },
    ],

    [`${path.BRAND_DETAIL}`]: [
        { label: "" },
    ],

    [`${path.WISHLIST}`]: [
        { label: "Danh sách sản phẩm yêu thích" }
    ],

    [`${path.SEARCH}`]: [
        { label: "Kết quả tìm kiếm" }
    ],

    [`${path.CART}`]: [
        { label: "Giỏ hàng" }
    ],

    [`${path.CONTACT}`]: [
        { label: "Liên hệ" }
    ],

    [`${path.INTRODUCE}`]: [
        { label: "Giới thiệu" }
    ],

    [`${path.PUCHARSE_GUIDE}`]: [
        { label: "Chính sách thanh toán & Hướng dẫn mua hàng" }
    ],

    [`${path.INSPECTION_GUIDE}`]: [
        { label: "Hướng dẫn kiểm hàng" }
    ],

    [`${path.TERM_OF_USE}`]: [
        { label: "Điều khoản sử dụng" }
    ],

    [`${path.PURCHASE_POLICY}`]: [
        { label: "Chính sách mua hàng" }
    ],

    [`${path.PRIVACY_POLICY}`]: [
        { label: "Chính sách bảo mật thông tin" }
    ],

    [`${path.RETURN_POLICY}`]: [
        { label: "Chính sách đổi trả - bảo hành" }
    ],

    [`${path.SHIPPING_POLICY}`]: [
        { label: "Chính sách giao hàng" }
    ],

    [`${path.PAYMENT_SECURITY_POLICY}`]: [
        { label: "Chính sách bảo mật thanh toán" }
    ],
    
};
