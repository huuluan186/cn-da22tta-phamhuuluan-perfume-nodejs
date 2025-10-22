import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { path } from "../../constants/path";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isLoggedIn, isAdmin } = useSelector(state => state.auth);
    const location = useLocation();

    if (!isLoggedIn) return <Navigate to={path.LOGIN} state={{ from: location }} replace />;

    if (requireAdmin && isAdmin !== requireAdmin)  return <Navigate to={path.HOME} replace />;

    return children;
}

export default ProtectedRoute
