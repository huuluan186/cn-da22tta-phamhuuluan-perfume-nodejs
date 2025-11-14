import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllCategories } from "../../store/actions/category";
import { getAllBrands } from "../../store/actions/brand";
import { path } from "../../constants/path";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const CategorySidebar = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const { brands } = useSelector((state) => state.brand);

    // Mở rộng từng phần
    const [openSections, setOpenSections] = useState({
        brands: false,
        categories: false,
    });

    useEffect(() => {
        dispatch(getAllCategories());
        dispatch(getAllBrands());
    }, [dispatch]);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="bg-white border shadow-sm p-5 font-sans">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">DANH MỤC</h2>

            <ul className="space-y-1">

                {/* Trang chủ */}
                <NavItem to={path.HOME} label="Trang chủ" />

                {/* Giới thiệu */}
                <NavItem to={path.INTRODUCE} label="Giới thiệu" />

                {/* Thương hiệu - có dropdown */}
                <DropdownSection
                    label="Thương hiệu"
                    isOpen={openSections.brands}
                    onToggle={() => toggleSection("brands")}
                    items={brands.map((b) => ({
                        label: b.name,
                        to: `/nuoc-hoa/${b.name}`,
                    }))}
                />

                {/* Nước hoa - có dropdown */}
                <DropdownSection
                    label="Nước hoa"
                    isOpen={openSections.categories}
                    onToggle={() => toggleSection("categories")}
                    items={categories.map((c) => ({
                        label: c.name,
                        to: `${path.COLLECTIONS}/${c.slug}`,
                    }))}
                />

                {/* Liên hệ */}
                <NavItem to={path.CONTACT} label="Liên hệ" />
            </ul>
        </div>
    );
};

/* === Component con === */
const NavItem = ({ to, label }) => (
    <li>
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-colors ${
                isActive ? "bg-gray-100 font-medium text-black" : ""
            }`}
        >
            {label}
        </NavLink>
    </li>
);

const DropdownSection = ({ label, isOpen, onToggle, items }) => (
    <li>
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
            <span>{label}</span>
            {isOpen ? (
                <MdKeyboardArrowUp className="text-gray-500" />
            ) : (
                <MdKeyboardArrowDown className="text-gray-500" />
            )}
        </button>

        {/* Dropdown content */}
        {isOpen && (
            <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                {items.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `block py-1.5 px-2 text-sm text-gray-600 hover:text-black transition-colors ${
                                isActive ? "font-medium text-black" : ""
                            }`}
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        )}
    </li>
);

export default CategorySidebar;