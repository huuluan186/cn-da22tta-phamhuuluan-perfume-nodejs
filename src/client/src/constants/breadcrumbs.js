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
};
