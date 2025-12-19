import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/actions/auth";
import { path } from "../../constants/path";
import icons from '../../assets/react-icons/icon'
const {FiHome, FiLock, FiLogOut} = icons;

const AdminHeader = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
            {/* Left */}
            <h1 className="text-xl font-bold text-primary tracking-wide">
                Admin Dashboard
            </h1>

            {/* Right */}
            <div className="flex items-center gap-6">
                {/* User info */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        Xin chào, {user?.firstname} {user?.lastname}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(path.HOME)}
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition"
                    >
                        <FiHome />
                        Xem Website
                    </button>

                    <button
                        onClick={() => navigate(`${path.ACCOUNT}/${path.CHANGE_PASSWORD}`)}
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-orange-600 hover:bg-orange-50 transition"
                    >
                        <FiLock />
                        Đổi mật khẩu
                    </button>

                    <button
                        onClick={() => dispatch(logout())}
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
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
