import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { NavLink, Outlet } from "react-router-dom"
import { path } from "../constants/path"
import { getMyAddresses } from "../store/actions/address";
import { getMyCoupons } from "../store/actions/coupon";

const activeClass = 'block px-4 py-2 rounded-md font-bold text-primary bg-primary/10';
const inactiveClass = 'block px-4 py-2 rounded-md text-gray-800 hover:bg-gray-100';

const AccountLayout = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.user)
    const { addresses } = useSelector(state => state.address)
    const { coupons } = useSelector(state => state.coupon);

    useEffect(() => {
        if (user?.id) {
            dispatch(getMyAddresses());
        }
    }, [dispatch, user?.id]);

    useEffect(() => {
        dispatch(getMyCoupons());
    }, [dispatch]);

    return (
        <div className="container bg-contentBg py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 border-r-4 pr-5">
                    <div className="mb-6">
                        <h1 className="text-xl font-normal mb-1">TRANG TÀI KHOẢN</h1>
                        <p className="text-base font-bold mb-2">
                            Chào bạn,{" "}
                            <span className="text-primary">
                                {user?.firstname || 'khách'} {user?.lastname || 'hàng'}
                            </span> 
                            {" "}!
                        </p>
                    </div>
                    <ul className="space-y-3">
                        <li>
                            <NavLink
                                to={path.ACCOUNT}
                                end
                                className={({isActive})=> `${isActive ? activeClass : inactiveClass}` }
                            >
                                Thông tin tài khoản
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={path.ORDERS_HISTORY}
                                className={({isActive})=> `${isActive ? activeClass : inactiveClass}` }
                            >
                                Đơn hàng của bạn
                            </NavLink>
                        </li>
                        {user?.isSocialAccount === false && 
                            <li>
                                <NavLink
                                    to={path.CHANGE_PASSWORD}
                                    className={({isActive})=> `${isActive ? activeClass : inactiveClass}` }
                                >
                                    Đổi mật khẩu
                                </NavLink>
                            </li>
                        }
                        <li>
                            <NavLink
                                to={path.ADDRESSES}
                                className={({isActive})=> `${isActive ? activeClass : inactiveClass}` }
                            >
                                Sổ địa chỉ ({addresses?.count})
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={path.MY_VOUCHER}
                                className={({isActive})=> `${isActive ? activeClass : inactiveClass}` }
                            >
                                Voucher của tôi ({coupons?.total})
                            </NavLink>
                        </li>
                    </ul>
                </div>
                
                <div className="md:col-span-3">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AccountLayout
