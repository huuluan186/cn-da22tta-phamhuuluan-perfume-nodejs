import { LoginForm, ForgotPassword } from "../../components/index"
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { path } from "../../constants/path";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // Đồng bộ state với fragment #recover
    useEffect(() => {
        setShowForgotPassword(location.hash === "#recover");
    }, [location.hash]);
    // Toggle giữa form đăng nhập và quên mật khẩu, cập nhật URL
    const handleToggle = () => {
        if (showForgotPassword) navigate(path.LOGIN); 
        else navigate(path.FORGOT_PASSWORD); // Thêm #recover
        setShowForgotPassword(!showForgotPassword);
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-contentBg w-full">
            {!showForgotPassword ? (
                <LoginForm onForgotPassword={handleToggle} />
            ) : (
                <ForgotPassword onBack={handleToggle} />
            )}
        </div>
    )
}

export default Login
