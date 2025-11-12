import { navbarItems } from "../../constants/navbarItems"
import icons from "../../assets/react-icons/icon"
import {DropdownMenu} from '../index'
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/actions/category";
import { getAllBrands } from "../../store/actions/brand";

const { MdKeyboardArrowRight } = icons;

const Navbar = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.category);
    const { brands } = useSelector(state => state.brand);

    // Tạo bản sao của navbarItems để thêm submenu động
    const dynamicNavbarItems = [...navbarItems];
    dynamicNavbarItems[2].submenu = brands.map(brand => ({
        label: brand.name,
        path: `/nuoc-hoa/${brand.name}`
    }));
    dynamicNavbarItems[3].submenu = categories.map(category => ({
        label: category.name,
        path: `/nuoc-hoa/${category.slug}`
    }));

    useEffect(() => {
        dispatch(getAllCategories());
        dispatch(getAllBrands());
    }, [dispatch]);
    
    return (
        <div className='w-full cursor-pointer'>
            <ul className="w-full flex">
                {navbarItems.map(item => (
                    <li 
                        key={item.label}
                        className="flex-1 relative group transition-colors duration-200 text-base sm:text-sm md:text-lg text-center hover:bg-secondary hover:text-contentBg"
                    >
                        <NavLink 
                            to={item.path} 
                            className={({ isActive }) => 
                                `block py-2 font-semibold hover:font-bold ${
                                    isActive ? 'bg-secondary text-white' : ''
                                }`
                            }
                        >
                            {item?.label}
                            {item?.hasDropdown && <MdKeyboardArrowRight className="inline-block w- mb-1" />}
                        </NavLink>

                        {/* Render dropdown nếu có submenu */}
                        {item.hasDropdown && item.submenu && (
                            <DropdownMenu 
                                items={item.submenu.map(sub => ({
                                    label: sub.label,
                                    onClick: () => { window.location.href = sub.path }
                                }))}
                                width={item.label === 'THƯƠNG HIỆU' ? 'w-[160vh]' : 'w-72'}
                                align="center"
                                columns={item.label === 'THƯƠNG HIỆU' ? 5 : 1}
                            />
                        )} 
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Navbar
