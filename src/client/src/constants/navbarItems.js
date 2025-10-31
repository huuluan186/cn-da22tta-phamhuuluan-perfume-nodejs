import { path } from "./path";

export const navbarItems = [
    { 
        label: "TRANG CHỦ", 
        path: path.HOME, 
    },
    { 
        label: "GIỚI THIỆU", 
        path: path.INTRODUCE,
    },
    { 
        label: "THƯƠNG HIỆU", 
        path: path.HOME,
        hasDropdown: true,
        submenu: [
            { label: "Brand A", path: "/thuong-hieu/brand-a" },
            { label: "Brand B", path: "/thuong-hieu/brand-b" },
            { label: "Brand C", path: "/thuong-hieu/brand-c" },
        ]
    },
    { 
        label: "NƯỚC HOA", 
        path: path.PERFUME,
        hasDropdown: true,
        submenu: [
            { label: "Nước hoa nam", path: "/nuoc-hoa/nam" },
            { label: "Nước hoa nữ", path: "/nuoc-hoa/nu" },
        ]
    },
    { 
        label: "NƯỚC HOA CHIẾT", 
        path: path.PERFUME_SAMPLE,
        hasDropdown: true,
        submenu: [
            { label: "Chiết nam", path: "/nuoc-hoa-chiet/nam" },
            { label: "Chiết nữ", path: "/nuoc-hoa-chiet/nu" },
        ]
    },
    { 
        label: "LIÊN HỆ", 
        path: path.CONTACT,
    },
];
