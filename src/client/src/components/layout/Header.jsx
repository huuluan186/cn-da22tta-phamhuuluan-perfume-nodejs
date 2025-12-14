import {SearchBar, DropdownMenu, CartDropdownContent} from '../index'
import logo from '../../assets/images/Perfumora_Logo_Artistic_3-removebg-preview.png'
import icons from '../../assets/react-icons/icon'
import { accountMenuItems } from "../../constants/menuItems";
import { useNavigate } from "react-router-dom";  
import { path } from '../../constants/path';
import { useSelector, useDispatch } from "react-redux";
import { apiGetMyFavorites } from '../../api/user';
import { useState, useEffect } from 'react';
import { getMyCart } from '../../store/actions/cart';

const {FaHeart, FaShoppingCart, MdKeyboardArrowDown} = icons;

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { cart } = useSelector(state => state.cart);
    const isLoggedIn = !!user;
    const [favoriteItems, setFavoriteItems] = useState([]);

    // Lấy số sản phẩm yêu thích khi mount
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isLoggedIn) return;
            try {
                const res = await apiGetMyFavorites();
                if (res?.data?.err === 0) {
                    setFavoriteItems(res.data.response || []);
                }
            } catch (err) {
                console.error("Lỗi lấy favorites:", err);
            }
        };
        fetchFavorites();
        window.addEventListener('favoritesUpdated', fetchFavorites);
        return () => window.removeEventListener('favoritesUpdated', fetchFavorites);
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getMyCart());
        }
    }, [dispatch, isLoggedIn]);
    
    return (
        <div className='flex flex-col sm:flex-row justify-between items-center py-4'>
            {/* LEFT: Search */}
            <div className="sm:flex items-center justify-center">
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
                            <p 
                                className="font-semibold max-w-48 truncate" 
                                title={`${user?.firstname} ${user?.lastname}`}
                            >
                                Xin chào{user && `, ${user?.firstname} ${user?.lastname}`}
                            </p>
                            {!isLoggedIn && (
                                <p className="text-xs">
                                    <span 
                                        className="font-bold cursor-pointer hover:underline"
                                        onClick={() => navigate(path.LOGIN)}
                                    >
                                        Đăng nhập 
                                    </span> 
                                    {" "}hoặc{" "}
                                    <span 
                                        className="font-bold cursor-pointer hover:underline" 
                                        onClick={() => navigate(path.REGISTER)}
                                    >
                                        Đăng ký
                                    </span>
                                </p>
                            )}            
                        </div>
                        <span className="inline-block transition-transform duration-700 ease-in-out">
                            <MdKeyboardArrowDown className="inline-block rotate-0 group-hover:rotate-180 w-5 h-5" />
                        </span>
                    </div>

                    {/* Menu dropdown */}
                    <DropdownMenu
                        items={accountMenuItems(navigate, dispatch, isLoggedIn)}
                        align="right"
                    />
                    
                </div>
                
                <div className="h-12 border-l border-gray-400"></div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <div className='relative py-2' onClick={()=> navigate(path.WISHLIST)}>
                        <FaHeart className="text-2xl cursor-pointer hover:text-gray-300" />
                        <span className="absolute top-1 -right-2 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            {favoriteItems.length}
                        </span>
                    </div>
                    <div className='relative group'>
                        <div className="relative py-2" onClick={()=>navigate(path.CART)}>
                            <FaShoppingCart className="text-2xl cursor-pointer hover:text-gray-300" />
                            <span className="absolute top-1 -right-2 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                {cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                            </span>
                        </div>      
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
