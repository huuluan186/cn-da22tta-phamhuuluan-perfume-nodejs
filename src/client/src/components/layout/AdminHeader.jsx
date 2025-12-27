import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/actions/auth";
import { path } from "../../constants/path";
import icons from '../../assets/react-icons/icon'
const { FiHome, FiLock, FiLogOut } = icons;

const AdminHeader = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <header className="h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg flex items-center justify-between px-6 border-b border-gray-700">
            {/* Left */}
            <h1 className="text-xl font-bold text-yellow-400 tracking-wide uppercase">
                Administration Panel
            </h1>

            {/* Right */}
            <div className="flex items-center gap-6">
                {/* User info */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300">
                        Xin chào, <span className="text-yellow-400 font-semibold">{user?.firstname} {user?.lastname}</span>
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(path.HOME)}
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-yellow-400 hover:bg-gray-700 transition border border-yellow-600/30"
                    >
                        <FiHome />
                        Xem Website
                    </button>

                    <button
                        onClick={() => navigate(`${path.ACCOUNT}/${path.CHANGE_PASSWORD}`)}
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-orange-400 hover:bg-gray-700 transition border border-orange-600/30"
                    >
                        <FiLock />
                        Đổi mật khẩu
                    </button>

                    <button
                        onClick={() => dispatch(logout())}
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-gray-700 transition border border-red-600/30"
                    >
                        <FiLogOut />
                        Đăng xuất
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
