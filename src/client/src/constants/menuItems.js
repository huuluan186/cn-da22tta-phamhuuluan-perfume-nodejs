import { path } from "../constants/path";
import { logout } from '../store/actions/auth'

export const accountMenuItems = (navigate, dispatch, isLoggedIn, user) => {
    const isAdmin = user?.roles?.some(role => role.name === "admin");
    return [
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
                    label: "Lịch sử giao dịch",
                    onClick: () => { navigate(`${path.ACCOUNT}/${path.MY_ORDER}`) }
                },
                ...(isAdmin
                        ? [
                            {
                                label: "Trang quản trị",
                                onClick: () => navigate(path.ADMIN),
                            },
                        ]
                        : []),
                {
                    label: "Đăng xuất",
                    onClick: () => {
                        dispatch(logout());
                        navigate(path.HOME);
                    },
                }
            ] : []
        ),
    ]
    
};
