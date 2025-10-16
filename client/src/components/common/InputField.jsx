import icons from '../../assets/react-icons/icon';
import { useState } from 'react';

const { FiEye, FiEyeOff } = icons;

const InputField = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    error,
    setError,
    required = false,
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        onChange(e);
        // Nếu ô này có lỗi và người dùng đang nhập, thì xóa lỗi của ô đó
        if (error && e.target.value.trim() !== "") {
            setError((prev) => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <div className="mt-3 flex-1">
            <label className="block text-sm font-medium mb-1">
                {label}{required && <span className="text-red-500">*</span>}
            </label>
            <div className='relative'>
                <input
                    type={type === 'password' && showPassword ? 'text' : type || 'text'}                    
                    name={name}
                    value={value}
                    onChange={handleChange}
                    required={required}
                    className={`w-full border rounded-md p-2 focus:outline-gray-400 ${
                    error ? "border-red-500" : "border-gray-300"
                    }`}
                />
    
                {type === 'password' && (
                    <span
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default InputField;
