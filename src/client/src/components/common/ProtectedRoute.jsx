import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { path } from "../../constants/path";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useSelector(state => state.user);
    const location = useLocation();

    // Nếu vẫn đang fetch user (vừa reload xong) → không redirect, không render
    if (loading) return null;

    //  Nếu fetch xong mà không có user → về trang đăng nhập
    if (!user) {
        if (!toast.isActive("login-warning")) {
            toast.warning("Vui lòng đăng nhập để tiếp tục!", {
                toastId: "login-warning",
            });
        }
        return <Navigate to={path.LOGIN} state={{ from: location }} replace />;
    }

    // Nếu route yêu cầu admin mà user không phải admin
    if (requireAdmin && !user.isAdmin) {
        return <Navigate to={path.HOME} replace />;
    }

    return children; // Có user → render children (Account, OrderHistory, v.v.)
};

export default ProtectedRoute;
