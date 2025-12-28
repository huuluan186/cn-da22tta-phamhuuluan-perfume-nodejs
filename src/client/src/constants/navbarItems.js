import { path } from "./path";
import icons from '../assets/react-icons/icon'
const {IoHome} = icons;

export const navbarItems = [
    { 
        label: "TRANG CHỦ", 
        path: path.HOME, 
        icon: IoHome
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
        label: "BỘ SƯU TẬP", 
        path: `${path.COLLECTIONS}/${path.ALL_PRODUCTS}`,
        hasDropdown: true,
        submenu: [] // merge dynamic trong Navbar.jsx
    },
    { 
        label: "LIÊN HỆ", 
        path: path.CONTACT,
    },
];
