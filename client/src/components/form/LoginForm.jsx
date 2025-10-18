import { useState, useEffect } from "react";
import { path } from "../../constants/path";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../../utils/validateForm";
import {InputField, Button} from '../index'
import icons from '../../assets/react-icons/icon'
import { useDispatch, useSelector  } from "react-redux";
import { login } from '../../store/actions/auth'
import { toast } from "react-toastify";

const {FaFacebookF, FaGoogle} = icons

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, msg, errorToggle } = useSelector(state => state.auth)

    const [payload, setPayload] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 🔍 Gọi hàm validateRegister
        const { valid, errors: formErrors } = validateLogin(payload);
        if (!valid) {
            setErrors(formErrors);
            return;
        }
        // Xóa lỗi cũ (nếu có)
        setErrors({});
        try {
            await dispatch(login(payload))
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            toast.success(msg);
            navigate(path.HOME);
        } else if (msg) {
            toast.error(msg || "Đăng nhập thất bại!");
        }
    }, [isLoggedIn, msg, errorToggle, navigate]);

    return (
        <form 
            className='bg-white shadow-[0_0_30px_10px_rgba(34,197,94,0.4)] rounded-md px-16 py-8'
        >
            <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
                ĐĂNG NHẬP TÀI KHOẢN
            </h2>

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

           <div className="py-4">
                <Button 
                    text={"Đăng nhập"}
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
                    Bạn chưa có tài khoản?{" "}
                    <span
                        className="text-primary cursor-pointer hover:underline"
                        onClick={() => navigate(path.REGISTER)}
                    >
                        Đăng ký tại đây
                    </span>
                </p>
                <p className="text-primary cursor-pointer hover:underline">Quên mật khẩu? </p>
                <p className="font-semibold">Hoặc đăng nhập bằng: </p>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
                <Button 
                    text={'Google'}
                    textSize="text-sm"
                    IcBefore={FaGoogle}
                    bgColor="bg-[#E76F5C]"
                    hoverText="hover:none"
                    hoverBg="hover:bg-red-500"
                    
                />
                <Button 
                    text={'Facebook'}
                    textSize="text-sm"
                    IcBefore={FaFacebookF}
                    bgColor="bg-[#627AAD]"
                    hoverText="hover:none"
                    hoverBg="hover:bg-blue-500"
                />
            </div>
        </form>
    )
}

export default LoginForm
