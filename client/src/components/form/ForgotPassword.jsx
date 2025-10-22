import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiForgotPassword } from "../../api/user"; 
import { InputField, Button } from "../index";
import { toast } from "react-toastify";
import { path } from "../../constants/path";
import { validateForgotPassword } from "../../utils";
import { jwtDecode } from "jwt-decode";

const ForgotPassword = ({ onBack }) => {
    const navigate = useNavigate();
    const [error, setError] = useState({}); 
    const [payload, setPayload] = useState({ forgotEmail: ""});
    

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        const { valid, errors: formErrors } = validateForgotPassword({email: payload.forgotEmail});
        if (!valid) {
            setError({ forgotEmail: formErrors.email || "" });
            return;
        }
        setError({});
        try {
            const response = await apiForgotPassword({ email: payload.forgotEmail });
            console.log(response)
            toast.success("Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.");
            setPayload({ forgotEmail: "" });
            const { token } = response.data || {};
            if (token) {
                const decodedToken = jwtDecode(token); // Giải mã token
                const userId = decodedToken.id; // Lấy userId từ token
                console.log("userId, token: ", userId, token)
                if (userId) {
                    navigate(
                        `${path.RESET_PASSWORD.replace(":userId", userId).replace(":token", token)}`
                    );
                } else console.log("Không tìm thấy userId trong token!")
            } else console.log("Không nhận được token từ server!");
        } catch (error) {
            toast.error("Gửi email thất bại: " + (error.response?.data?.msg || "Lỗi không xác định"));
        }
    };

    const handleChange = (e) => {
        setPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form 
            className='bg-white shadow-[0_0_30px_10px_rgba(34,197,94,0.4)] rounded-md px-16 py-8 min-h-80 w-1/2 flex flex-col justify-center'
        >
            <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
                ĐẶT LẠI MẬT KHẨU
            </h2>
            <p className="text-center text-gray-600 mb-2">
                Nhập địa chỉ email để lấy lại mật khẩu qua email.
            </p>
        
            <InputField
                label="Email"
                type="email"
                name="forgotEmail"
                required={true}
                value={payload.forgotEmail}
                onChange={handleChange}
                error={error.forgotEmail}
                setError={setError}
            />
            <div className="py-5">
                <Button
                    text={"LẤY LẠI MẬT KHẨU"}
                    textSize={"text-lg"}
                    hoverBg={"hover:bg-green-800"}
                    hoverText={"hover:text-white"}
                    width={"w-30"}
                    rounded={"rounded-sm"}
                    onClick={handleForgotPasswordSubmit}
                />
            </div>

            <p
                className="text-center text-primary cursor-pointer hover:underline mt-2"
                onClick={onBack}
            >
                Quay lại đăng nhập
            </p>
        </form>
    );
};

export default ForgotPassword;