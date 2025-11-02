import { useSelector } from "react-redux"
import { NavLink, Outlet } from "react-router-dom"
import { path } from "../constants/path"

const activeClass = 'cursor-pointer font-bold underline'
const inactiveClass = 'cursor-pointer text-black hover:text-primary'

const AccountLayout = () => {
    const {user} = useSelector(state => state.user)
    const { addresses } = useSelector(state => state.address)

    return (
        <div className="container bg-contentBg py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
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
                        <li>
                            <NavLink
                                to={path.CHANGE_PASSWORD}
                                className={({isActive})=> `${isActive ? activeClass : inactiveClass}` }
                            >
                                Đổi mật khẩu
                            </NavLink>
                        </li>
                         <li>
                            <NavLink
                                to={path.ADDRESSES}
                                className={({isActive})=> `${isActive ? activeClass : inactiveClass}` }
                            >
                                Sổ địa chỉ ({addresses?.count})
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
