import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { path } from "../../constants/path";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user } = useSelector(state => state.user);
    const location = useLocation();

    // Nếu chưa có user, redirect về login
    if (!user) {
        return <Navigate to={path.LOGIN} state={{ from: location }} replace />;
    }

    // Nếu route yêu cầu admin mà user không phải admin
    if (requireAdmin && !user.isAdmin) {
        return <Navigate to={path.HOME} replace />;
    }

    return children;
};

export default ProtectedRoute;
