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
        path: path.BRANDS,
        hasDropdown: true,
        submenu: [] // merge dynamic trong Navbar.jsx
    },
    { 
        label: "NƯỚC HOA", 
        path: `${path.COLLECTIONS}/${path.ALL_PRODUCTS}`,
        hasDropdown: true,
        submenu: [] // merge dynamic trong Navbar.jsx
    },
    { 
        label: "LIÊN HỆ", 
        path: path.CONTACT,
    },
];
