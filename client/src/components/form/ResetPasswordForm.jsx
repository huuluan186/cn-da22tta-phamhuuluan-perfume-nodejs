import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiResetPassword } from "../../api/user"; 
import { toast } from "react-toastify";
import { path } from "../../constants/path";
import { InputField, Button } from "../../components/index"
import { validateResetPassword } from "../../utils"

const ResetPasswordForm = ({ token }) => {
    const navigate = useNavigate();

    const [payload, setPayload] = useState({
        token: "",
        newPassword: "",
        confirmPassword: "" 
    })
    const [errors, setErrors] = useState("");

    useEffect(() => {
        if (token) setPayload((prev) => ({ ...prev, token }));
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { valid, errors: formErrors } = validateResetPassword({
            newPassword: payload.newPassword,
            confirmPassword: payload.confirmPassword,
        });
        if (!valid) {
            setErrors(formErrors);
            return;
        }
        // Xóa lỗi cũ (nếu có)
        setErrors({});
        const { confirmPassword, ...data } = payload;
        try {
            const response = await apiResetPassword(data)
            if(response?.data?.err == 0){
                toast.success("Mật khẩu đã được đặt lại thành công!");
                navigate(path.ACCOUNT);
            }else toast.error(response?.data?.msg)
        } catch (err) {
            setErrors(err.response?.data?.msg || "Lỗi không xác định");
        }
    };

    const handleChange = (e) => {
        setPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form>
            <div className="w-[500px] space-y-8">
                <InputField 
                    type="password"
                    label={"Mật khẩu mới"}
                    name="newPassword"
                    required={true}
                    value={payload.newPassword}
                    onChange={handleChange}
                    error={errors.newPassword}
                    setError={setErrors}
                />
                <InputField 
                    type="password"
                    label={"Xác nhận mật khẩu"}
                    name="confirmPassword"
                    required={true}
                    value={payload.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    setError={setErrors}
                />
            </div>
            <div className="mt-7">
                <Button 
                    type="submit"
                    text={"Đặt lại mật khẩu"}
                    width="w-40"
                    rounded="rounded-sm"
                    hoverBg="hover:bg-green-900"
                    hoverText="hover:none"
                    onClick={handleSubmit}
                />
            </div>
        </form>
    );
};

export default ResetPasswordForm;