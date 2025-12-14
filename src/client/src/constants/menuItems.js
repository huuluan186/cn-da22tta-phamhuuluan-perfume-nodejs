import { path } from "../constants/path";
import { logout } from '../store/actions/auth'

export const accountMenuItems = (navigate, dispatch, isLoggedIn) => [
    { label: "Tài khoản", 
        onClick: () => { navigate(path.ACCOUNT) } 
    },
    { label: "Sổ địa chỉ", 
        onClick: () => { navigate(`${path.ACCOUNT}/${path.ADDRESSES}`) }
    },
    ...(isLoggedIn === true
        ? [
            {
                label: "Ví voucher của tôi",
                onClick: () => { navigate(`${path.ACCOUNT}/${path.MY_VOUCHER}`) }
            },
            {
                label: "Đăng xuất",
                onClick: () => {
                    dispatch(logout());
                    navigate(path.HOME);
                },
            }
        ] : []
    ),
];
