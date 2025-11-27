import { useEffect } from "react";
import { Button } from '../index'

const Modal = ({
    icon,           // React component icon, ví dụ MdCheckCircle
    message = "",   // Nội dung hiển thị
    onClose,        // Callback khi đóng modal
    onConfirm,      // Callback khi xác nhận (dùng cho confirm)
    showConfirm = false, // Nếu true thì hiển thị nút Xác nhận + Hủy
    autoClose = 0,       // Tự đóng sau n ms, 0 = không tự đóng
}) => {
    useEffect(() => {
        if (autoClose > 0) {
            const timer = setTimeout(() => onClose(), autoClose);
            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-lg max-w-md w-full h-[40vh] max-h-[90vh] overflow-y-auto scrollbar-hide">
                {icon && <span className="mb-4">{icon}</span>}
                <p className="text-lg font-semibold text-center text-gray-800">{message}</p>

                {autoClose === 0 && (
                    <div className="mt-4 flex gap-4">
                        {showConfirm ? (
                            <>
                                <button
                                    onClick={onConfirm}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                                >
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                                Đóng
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
