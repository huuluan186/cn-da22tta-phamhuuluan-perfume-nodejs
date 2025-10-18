import { path } from "../constants/path";
import { logout } from '../store/actions/auth'

export const accountMenuItems = (navigate, dispatch, isLoggedIn) => [
    { label: "Tài khoản", onClick: () => console.log("Thông tin cá nhân") },
    { label: "Sổ địa chỉ", onClick: () => console.log("Đơn hàng của tôi") },
    {
        label: "Đăng xuất",
        onClick: () => {
            dispatch(logout());
            navigate(path.HOME);
        },
    },
];
