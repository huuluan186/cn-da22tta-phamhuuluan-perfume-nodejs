import { useState } from "react";
import { apiForgotPassword } from "../../api/user"; 
import { InputField, Button } from "../index";
import { toast } from "react-toastify";
import { validateForgotPassword } from "../../utils";

const ForgotPassword = ({ onBack }) => {
    const [error, setError] = useState({}); 
    const [payload, setPayload] = useState({ forgotEmail: ""});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        const { valid, errors: formErrors } = validateForgotPassword({email: payload.forgotEmail});
        if (!valid) {
            setError({ forgotEmail: formErrors.email || "" });
            return;
        }
        setError({});
        setLoading(true);
        setSuccess(false);
        try {
            const response = await apiForgotPassword({ email: payload.forgotEmail });
            console.log(response)
            toast.success(response.data.msg || "Link đặt lại mật khẩu đã được gửi!");
            setSuccess(true);
            setPayload({ forgotEmail: "" });
        } catch (error) {
            toast.error(error.response?.data?.msg || "Lỗi không xác định");
        } finally {
            setLoading(false);  
        }
    };

    const handleChange = (e) => {
        setPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFocus = () => setSuccess(false);

    return (
        <form 
            className='bg-white shadow-[0_0_30px_10px_rgba(34,197,94,0.4)] rounded-md px-10 py-8 min-h-80 w-1/2 flex flex-col justify-center'
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
                onFocus={handleFocus}
                error={error.forgotEmail}
                setError={setError}
                className="mb-3"
            />
            <div className="py-5">
                <Button
                    type="submit"
                    text={"LẤY LẠI MẬT KHẨU"}
                    textSize={"text-lg"}
                    hoverBg={"hover:bg-green-800"}
                    hoverText={"hover:text-white"}
                    width={"w-30"}
                    rounded={"rounded-sm"}
                    onClick={handleForgotPasswordSubmit}
                />
            </div>
            
            {loading && (
                <p className="text-red-500 text-center font-medium my-2">
                    Đang gửi yêu cầu...
                </p>
            )}
    
            {!loading && success && (
                <p className="text-green-600 text-center font-medium my-1">
                    Link reset mật khẩu đã gửi về email!
                </p>
            )}

            <p
                className="text-center text-primary cursor-pointer hover:underline mt-1"
                onClick={onBack}
            >
                Quay lại đăng nhập
            </p>
        </form>
    );
};

export default ForgotPassword;