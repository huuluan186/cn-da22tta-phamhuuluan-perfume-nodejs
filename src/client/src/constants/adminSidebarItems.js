import { path } from './path';
import icons from '../assets/react-icons/icon'
const {
    MdCategory,
    MdLocalOffer,
    MdRateReview,
    MdContactMail,
    FaUsers,
    FaUserShield,
    FaBox,
    FaTrademark,
    FaShoppingCart,
    TbPresentationAnalyticsFilled,
    TbPerfume
} = icons

export const adminSidebarItems = [
    {
        label: "Thống kê",
        to: path.ADMIN_DASHBOARD,
        icon: <TbPresentationAnalyticsFilled />
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
        to: path.PRODUCT_MANAGER,
        icon: <TbPerfume />
    },
    {
        label: "Đơn hàng",
        to: path.ORDER_MANAGER,
        icon: <FaShoppingCart />
    },
    {
        label: "Coupon",
        to: path.COUPON_MANAGER,
        icon: <MdLocalOffer />
    },
    {
        label: "Đánh giá",
        to: path.REVIEW_MANAGER,
        icon: <MdRateReview />
    },
    {
        label: "Liên hệ",
        to: path.CONTACT_MANAGER,
        icon: <MdContactMail />
    }
];
