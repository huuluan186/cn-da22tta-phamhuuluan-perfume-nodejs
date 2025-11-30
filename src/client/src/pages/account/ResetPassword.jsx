import { useParams } from "react-router-dom";
import { ResetPasswordForm } from "../../components";

const ResetPassword = () => {
    return (
        <div className="flex flex-col items-center justify-center py-7 bg-contentBg w-full space-y-2">
            <div>
                <h2 className="text-2xl font-medium text-center">
                    LẤY LẠI MẬT KHẨU
                </h2>
            </div>
            <div>
                <ResetPasswordForm /> 
            </div>
        </div>
    );
};

export default ResetPassword;