import { navbarItems } from "../../constants/navbarItems"
import icons from "../../assets/react-icons/icon"
import { DropdownMenu } from '../index'
import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/actions/category";
import { getAllBrands } from "../../store/actions/brand";
import { path } from '../../constants/path'
import { useNavigate } from "react-router-dom";
import { toSlug } from "../../utils";

const { MdKeyboardArrowDown } = icons;

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { categories } = useSelector(state => state.category);
    const { brands } = useSelector(state => state.brand);

    // Tạo bản sao của navbarItems để thêm submenu động
    const dynamicNavbarItems = [...navbarItems];
    dynamicNavbarItems[2].submenu = brands.map(brand => ({
        label: brand.name,
        path: `${path.BRANDS}/${toSlug(brand.name)}`,
        state: { brandId: brand.id }
    }));
    dynamicNavbarItems[3].submenu = categories.map(category => ({
        label: category.name,
        path: `${path.COLLECTIONS}/${category.slug}`
    }));

    useEffect(() => {
        dispatch(getAllCategories());
        dispatch(getAllBrands());
    }, [dispatch]);
    
    return (
        <div className='w-full cursor-pointer'>
            <ul className="w-full flex">
                {dynamicNavbarItems.map((item, index) => (
                    <li 
                        key={item.label}
                        className="flex-1 relative group transition-colors duration-200 text-base sm:text-sm md:text-lg text-center hover:bg-primary/80 hover:text-white"
                    >
                        <NavLink 
                            to={item.path} 
                             className={({ isActive }) => {
                                const isBrandActive = location.pathname.startsWith(path.BRANDS);
                                const isCollectionActive = location.pathname.startsWith(path.COLLECTIONS);

                                const customActive =
                                    index === 2   // THƯƠNG HIỆU
                                        ? isBrandActive
                                        : index === 3 // BỘ SƯU TẬP
                                        ? isCollectionActive
                                        : isActive;

                                return `block py-2 font-semibold hover:font-bold ${
                                    customActive 
                                        ? 'font-bold text-[#C2113F]' 
                                        : ''
                                } flex items-center justify-center gap-1.5`;
                            }}
                        >
                            {item?.icon && <item.icon className="inline-block mr-1 text-lg" />}
                            {item?.label}
                            {item?.hasDropdown && (
                                <span className="inline-block transition-transform duration-700 ease-in-out">
                                    <MdKeyboardArrowDown className="inline-block rotate-0 group-hover:rotate-180" />
                                </span>
                            )}
                        </NavLink>

                        {/* Render dropdown nếu có submenu */}
                        {item.hasDropdown && item.submenu && (
                            <DropdownMenu 
                                items={item.submenu.map(sub => ({
                                    label: sub.label,
                                    onClick: () => navigate(sub.path, { state: sub.state })
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
