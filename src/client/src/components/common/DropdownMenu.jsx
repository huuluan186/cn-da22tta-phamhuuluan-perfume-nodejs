import { useRef } from "react";

const DropdownMenu = ({
    items = [], // Danh sách item để hiển thị trong dropdown (mỗi item có label + onClick)
    textColor = "text-black", // Màu chữ của dropdown
    width = 'w-full', // Nếu true thì dropdown rộng 100% theo SelectBox cha
    align = "left", // Căn trái, phải hoặc giữa ("left", "right", "center")
    offsetY=null, // để tuỳ chỉnh khoảng cách giữa dropdown và nút trigger (SelectBox).
    emptyMessage = "", // Message hiển thị khi không có item nào
    columns = 1,
}) => {

    const menuRef = useRef(null);

    // ======== XỬ LÝ VỊ TRÍ NGANG ========
    let horizontalClass = "";
    if (align === "left") horizontalClass = "left-0";
    else if (align === "center") horizontalClass = "left-1/2 -translate-x-1/2";
    else if (align === "right") horizontalClass = "right-0";
    
    const gridClass = {
        1: "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1",
        2: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2",
        3: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
        4: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
        5: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
    }[columns] || "grid grid-cols-1";

    return (
        <div
            ref={menuRef}
            className={`absolute top-full ${offsetY} ${horizontalClass} 
                        ${width} bg-white border border-gray-300 
                        shadow-[0_0_10px_rgba(0,0,0,0.2)] 
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-200 z-50 ${textColor} max-h-96 overflow-y-auto`}
        >
            <ul className={`${gridClass} gap-x-16 px-4`} >
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <li
                            key={index}
                            className={`py-2 text-base hover:text-primary hover:font-medium cursor-pointer ${
                                index !== items.length - 1 ? "border-b border-gray-200" : ""
                            }`}
                            onClick={item.onClick}
                        >
                            <span className="flex items-center gap-2 whitespace-nowrap">
                                {item.icon}
                                {item.label}
                            </span>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-2 text-gray-400 italic text-sm">
                        {emptyMessage ?? "Chưa có dữ liệu trong hệ thống"}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default DropdownMenu;
