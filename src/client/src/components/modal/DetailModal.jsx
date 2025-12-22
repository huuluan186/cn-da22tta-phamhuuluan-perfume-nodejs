import { memo } from "react";

const DetailModal = ({ open, onClose, title, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal wrapper – KHÔNG SCROLL */}
            <div
                className="
                relative bg-white rounded-lg shadow-xl
                w-auto max-w-[90vw] min-w-[85vh]
                max-h-[85vh]
                animate-fadeIn
                flex flex-col
                "
            >
                {/* Header (fixed) */}
                <div className="flex justify-between items-center px-6 py-4 border-b shrink-0">
                    <h3 className="text-xl font-bold uppercase whitespace-nowrap">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Body – SCROLL DUY NHẤT */}
                <div className="px-6 py-4 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default memo(DetailModal);
