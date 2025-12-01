import { ChangePasswordForm } from "../../components/index"
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { path } from "../../constants/path";

const ChangePassword = () => {
    const { user } = useSelector(state => state.user);
    if (user?.isSocialAccount === true) {
        return <Navigate to={path.ACCOUNT} replace />;
    }
    
    return (
        <div className="flex flex-col bg-contentBg w-full">
            <div className="mb-6 text-gray-600 space-y-6">
                <h2 className="text-xl font-medium ">ĐỔI MẬT KHẨU</h2>
                <div className="space-y-2">
                    <h4 className="text-base">Để đảm bảo tính bảo mật vui lòng đặt mật khẩu với ít nhất 6 kí tự</h4>
                    {/* <h4 className="text-sm italic">*Nếu bạn chưa liên kết tài khoản với Perfumora thì mật khẩu mặc định là: social_login</h4>    */}
                </div>
            </div>
            <div>
                <ChangePasswordForm />
            </div>
        </div>
    )
}

export default ChangePassword
