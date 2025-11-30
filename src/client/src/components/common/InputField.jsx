import icons from '../../assets/react-icons/icon';
import { useState } from 'react';

const { FiEye, FiEyeOff } = icons;

const InputField = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    onFocus,
    error,
    setError,
    required = false,
    isDisable = false,
    multiple = false,
    images = [],
    setImages = () => {},
    className = "",
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        onChange(e);
        // Nếu ô này có lỗi và người dùng đang nhập, thì xóa lỗi của ô đó
        if (error && e.target.value.trim() !== "") {
            setError((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleFocus = () => {
        if (setError) setError(prev => ({ ...prev, [name]: "" }));
        if (typeof onFocus === "function") onFocus();
    };


    // Xử lý upload file
    const handleUpload = (e) => {
        const files = Array.from(e.target.files);

        const format = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...format]);

        if (onChange) onChange(e);
    };

    if (type === "file") {
        return (
            <div  className={`flex-1 ${className}`}>
                <label className="block text-sm font-medium mb-1">
                    {label}{required && <span className="text-red-500">*</span>}
                </label>

                <div className="flex gap-3 flex-wrap">

                    {/* Ô upload */}
                    <label className="w-24 h-24 border-2 border-dashed rounded-lg 
                        flex items-center justify-center cursor-pointer 
                        text-gray-500 hover:bg-gray-100 hover:border-blue-300">

                        + Upload

                        <input
                            type="file"
                            name={name}
                            multiple={multiple}
                            onChange={handleUpload}
                            className="hidden"
                        />
                    </label>

                    {/* Preview ảnh */}
                    {images.length > 0 && images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24">
                            <img
                                src={img.preview}
                                alt="preview"
                                className="w-full h-full object-cover rounded border border-black"
                            />
                            <button
                                onClick={() =>
                                    setImages(prev => prev.filter((_, i) => i !== idx))
                                }
                                className="absolute -top-2 -right-2 bg-white text-black 
                                    rounded-full w-6 h-6 flex items-center justify-center 
                                    text-sm border"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex-1 ${className}`}>
            <label className="block text-sm font-medium mb-1">
                {label}{required && <span className="text-red-500">*</span>}
            </label>
            <div className='relative'>
                {/* TEXTAREA  */}
                {type === 'textarea' ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={handleChange}
                        required={required}
                        disabled={isDisable}
                        rows={4}
                        className={`w-full border rounded-md p-2 focus:outline-gray-400 ${
                            error ? "border-red-500" : "border-gray-300"
                        }`}
                    ></textarea>
                ) : (
                    // NORMAL INPUT
                    <input
                        type={type === 'password' && showPassword ? 'text' : type || 'text'}                    
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        required={required}
                        disabled={isDisable}
                        className={`w-full border rounded-md p-2 focus:outline-gray-400 ${
                        error ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                )}

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
