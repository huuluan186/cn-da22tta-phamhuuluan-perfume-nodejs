import {SearchBar, DropdownMenu, CartDropdownContent} from '../index'
import logo from '../../assets/images/Perfumora_Logo_Artistic_3-removebg-preview.png'
import icons from '../../assets/react-icons/icon'
import { accountMenuItems } from "../../constants/menuItems";
import { useNavigate } from "react-router-dom";  
import { path } from '../../constants/path';

const {FaHeart, FaShoppingCart, MdKeyboardArrowDown} = icons;
const cartItems = [
    // { id: 1, name: "Sản phẩm 1", quantity: 2, price: 150000 },
    // { id: 2, name: "Sản phẩm 2", quantity: 1, price: 90000 },
];

const Header = () => {
    const navigate = useNavigate()
    return (
        <div className='flex justify-between items-center py-4'>
            {/* LEFT: Search */}
            <div className="flex items-center">
                <SearchBar
                    rounded="rounded-md"
                    width="w-72"
                    height="h-10"
                    placeholder="Tìm kiếm sản phẩm..."
                />
            </div>

            {/* CENTER: Logo */}
            <div className='w-52 cursor-pointer'>
                <img src={logo} alt="logo" />
            </div>
            
            {/* RIGHT: Account + Icons */}
            <div className="flex items-center gap-6">
                {/* Account dropdown */}
                <div className="relative group">
                    <div className="text-left flex items-center cursor-pointer p-2 gap-1 rounded-md 
                    transition-shadow duration-200 ease-in-out
                    hover:bg-primary hover:shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <div>
                            <p className="font-semibold">Xin chào, Khách</p>
                            <p className="text-xs">
                                <span className="font-bold cursor-pointer hover:underline">Đăng nhập</span> hoặc{" "}
                                <span 
                                    className="font-bold cursor-pointer hover:underline" 
                                    onClick={() => navigate(path.REGISTER)}
                                >
                                    Đăng ký
                                </span>
                            </p>
                        </div>
                        <MdKeyboardArrowDown className="w-5 h-5 text-contentBg mt-1" />
                    </div>
                    {/* Menu dropdown */}
                    <DropdownMenu items={accountMenuItems} align="right" />
                </div>
                
                <div className="h-12 border-l border-gray-400"></div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <FaHeart className="text-2xl cursor-pointer hover:text-gray-300" />
                    <div className='relative group'>
                        <div className="relative py-2">
                            <FaShoppingCart className="text-2xl cursor-pointer hover:text-gray-300" />
                            <span className="absolute top-0 -right-2 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                {cartItems.length}
                            </span>
                        </div>
                        <DropdownMenu
                            items={[
                                { label: <CartDropdownContent items={cartItems} />}
                            ]}
                            width="w-72"
                            align="right"
                        />
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
