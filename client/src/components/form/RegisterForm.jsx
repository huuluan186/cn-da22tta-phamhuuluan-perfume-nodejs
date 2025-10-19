import { useState } from "react";
import { path } from "../../constants/path";
import { useNavigate } from "react-router-dom";
import { validateRegister } from "../../utils/validateForm";
import {InputField, Button} from '../index'
import icons from '../../assets/react-icons/icon'
import { apiRegister } from "../../api/auth";
import { toast } from "react-toastify";

const {FaFacebookF, FaGoogle} = icons

const RegisterForm = () => {
    const navigate = useNavigate();

    const [payload, setPayload] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Gọi hàm validateRegister
        const { valid, errors: formErrors } = validateRegister(payload);
        if (!valid) {
            setErrors(formErrors);
            return;
        }
        // Xóa lỗi cũ (nếu có)
        setErrors({});
        const { confirmPassword, ...data } = payload;
        try {
            const response = await apiRegister(data)
            if(response?.data?.err === 0) {
                toast.success(response?.data?.msg)
                navigate(path.LOGIN)
            }
            else toast.error(response?.data?.msg || 'Đăng ký thất bại!')
        } catch (error) {
            toast.error(error?.response?.data?.msg || "Đăng ký thất bại!");
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/facebook';
    };

    return (
        <form 
            className='bg-white shadow-[0_0_30px_10px_rgba(34,197,94,0.4)] rounded-md px-16 py-8'
        >
            <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
                ĐĂNG KÝ TÀI KHOẢN
            </h2>

            <div className="flex gap-2">
                <InputField
                    label="Họ"
                    name="firstname"
                    required={true}
                    value={payload.firstname}
                    onChange={handleChange}
                    error={errors.firstname}
                    setError={setErrors}
                />
                <InputField
                    label="Tên"
                    name="lastname"
                    required={true}
                    value={payload.lastname}
                    onChange={handleChange}
                    error={errors.lastname}
                    setError={setErrors}
                />
            </div>

            <InputField
                label="Email"
                type="email"
                name="email"
                required={true}
                value={payload.email}
                onChange={handleChange}
                error={errors.email}
                setError={setErrors}
            />

            <InputField
                label="Mật khẩu"
                type="password"
                name="password"
                required={true}
                value={payload.password}
                onChange={handleChange}
                error={errors.password}
                setError={setErrors}
            />

            <InputField
                label="Xác nhận mật khẩu"
                type="password"
                name="confirmPassword"
                required={true}
                value={payload.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                setError={setErrors}
            />

           <div className="py-4">
                <Button 
                    text={"Đăng ký"}
                    textSize={'text-lg'}
                    hoverBg={'hover:bg-green-800'}
                    hoverText={'hover:text-white'}
                    width={'w-30'}
                    rounded={'rounded-sm'}
                    onClick={handleSubmit}
                />
           </div>

            <div className="text-sm text-center my-3 space-y-2 text-gray-700">
                <p>
                    Bạn đã có tài khoản?{" "}
                    <span
                        className="text-primary cursor-pointer hover:underline"
                        onClick={() => navigate(path.LOGIN)}
                    >
                        Đăng nhập
                    </span>
                </p>
                <p className="font-semibold">Hoặc đăng ký bằng: </p>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
                <Button 
                    text={'Google'}
                    textSize="text-sm"
                    width="w-72"
                    IcBefore={FaGoogle}
                    bgColor="bg-[#E76F5C]"
                    hoverText="hover:none"
                    hoverBg="hover:bg-red-500"
                    onClick={handleGoogleLogin}
                    
                />
                <Button 
                    text={'Facebook'}
                    textSize="text-sm"
                    width="w-72"
                    IcBefore={FaFacebookF}
                    bgColor="bg-[#627AAD]"
                    hoverText="hover:none"
                    hoverBg="hover:bg-blue-500"
                    onClick={handleFacebookLogin}
                />
            </div>
        
        </form>
    )
}

export default RegisterForm
