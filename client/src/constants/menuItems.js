import { path } from "../constants/path";
import { logout } from '../store/actions/auth'

export const accountMenuItems = (navigate, dispatch, isLoggedIn) => [
    { label: "Tài khoản", 
        onClick: () => {
            navigate(path.ACCOUNT);
        } 
    },
    { label: "Sổ địa chỉ", onClick: () => console.log("Đơn hàng của tôi") },
    ...(isLoggedIn === true
    ? [
        {
            label: "Đăng xuất",
            onClick: () => {
                dispatch(logout());
                navigate(path.HOME);
            },
        }
    ] : []),
];
