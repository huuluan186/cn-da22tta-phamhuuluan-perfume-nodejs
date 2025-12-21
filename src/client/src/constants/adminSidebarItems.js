import { path } from './path';
import icons from '../assets/react-icons/icon'
const {
    MdDashboard,
    MdCategory,
    MdLocalOffer,
    MdRateReview,
    MdContactMail,
    FaUsers,
    FaUserShield,
    FaBox,
    FaTrademark,
    FaShoppingCart
} = icons

export const adminSidebarItems = [
    {
        label: "Thống kê",
        to: "/admin/dashboard",
        icon: <MdDashboard />
    },
    {
        label: "Người dùng",
        to: path.USER_MANAGER,
        icon: <FaUsers />
    },
    {
        label: "Phân quyền",
        to: path.ROLE_MANAGER,
        icon: <FaUserShield />
    },
    {
        label: "Danh mục",
        to: path.CATEGORY_MANAGER,
        icon: <MdCategory />
    },
    {
        label: "Thương hiệu",
        to: path.BRAND_MANAGER,
        icon: <FaTrademark />
    },
    {
        label: "Sản phẩm",
        to: "/admin/products",
        icon: <FaBox />
    },
    {
        label: "Đơn hàng",
        to: "/admin/orders",
        icon: <FaShoppingCart />
    },
    {
        label: "Coupon",
        to: "/admin/coupons",
        icon: <MdLocalOffer />
    },
    {
        label: "Đánh giá",
        to: "/admin/reviews",
        icon: <MdRateReview />
    },
    {
        label: "Liên hệ",
        to: "/admin/contacts",
        icon: <MdContactMail />
    }
];
