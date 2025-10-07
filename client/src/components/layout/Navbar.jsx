import { navbarItems } from "../../constants/navbarItems"
import icons from "../../assets/react-icons/icon"
import {DropdownMenu} from '../index'
import { NavLink } from "react-router-dom";

const { MdKeyboardArrowRight } = icons;

const Navbar = () => {
    return (
        <div className='w-full cursor-pointer'>
            <ul className="w-full flex">
                {navbarItems.map(item => (
                    <li 
                        key={item.label}
                        className="flex-1 relative group transition-colors duration-200 text-center hover:bg-secondary hover:text-contentBg"
                    >
                        <NavLink to={item.path} className="block py-2 font-semibold  hover:font-bold">
                            {item?.label}
                            {item?.hasDropdown && <MdKeyboardArrowRight className="inline-block mb-1" />}
                        </NavLink>

                        {/* Render dropdown nếu có submenu */}
                        {item.hasDropdown && item.submenu && (
                            <DropdownMenu 
                                items={item.submenu.map(sub => ({
                                    label: sub.label,
                                    onClick: () => { window.location.href = sub.path }
                                }))}
                                width="w-72"
                                align="center"
                            />
                        )}
                        
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Navbar
