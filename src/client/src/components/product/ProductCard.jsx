import { getImageUrl, formatProductPrice, formatPrice, toSlug } from "../../utils/index";
import icons from "../../assets/react-icons/icon";
import { Button } from "../index"
import { useNavigate } from "react-router-dom";
import { path } from "../../constants/path";
import { apiAddFavorite, apiRemoveFavorite, apiGetMyFavorites } from "../../api/user";
import { useState, useEffect } from "react";

/**
    * Component hiển thị 1 sản phẩm dạng thẻ
    * @param {Object} product - Thông tin sản phẩm
    * @param {Function} onClick - Hành động khi click vào card (nếu có)
    * @param {String} className - Class tùy chỉnh thêm (nếu có)
    * Local state: isFavorite để toggle, loading để tránh click liên tục
*/

const { FaEye, FaRegHeart, FaHeart } = icons

const ProductCard = ({ 
    product, 
    className = "", 
    viewMode = "grid", 
    textAlign = "left", 
    onRemove, //dùng trong xóa sản phẩm khỏi danh sách yêu thích
}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    // Xử lý giá sản phẩm
    const priceText = formatProductPrice(product);

    // Khi mount, kiểm tra sản phẩm đã tim chưa 
    useEffect(() => { 
        if (!product) return;
        const checkFavorite = async () => { 
            try { 
                const res = await apiGetMyFavorites();
                if (res?.data?.err === 0 ){
                    const favIds = res.data.response?.map(p => p.productId); 
                    setIsFavorite(favIds.includes(product.id)); 
                } 
            } 
            catch (err) { 
                console.error("Lỗi lấy wishlist:", err); 
            } 
        } 
        checkFavorite(); 
    }, [product.id]);

    const handleClick = () => {
        const slug = toSlug(product.name);
        navigate(path.PRODUCT_DETAIL.replace(":slug", slug));  // điều hướng tới trang chi tiết
    };

    const toggleFavorite = async (e) => { 
        e.stopPropagation(); 
        try { 
            if (isFavorite) {
                await apiRemoveFavorite(product.id);
                setIsFavorite(false);
                if (onRemove) onRemove(product.id); // remove card ngay
            } else {
                await apiAddFavorite(product.id); 
                setIsFavorite(true);
            }
            window.dispatchEvent(new Event('favoritesUpdated'));
        } catch (err) { 
            console.error("Lỗi khi cập nhật wishlist:", err); 
        } 
    };

    const iconsList = [
        {   
            Icon: FaEye,
            onClick: (e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('openQuickView', { detail: product.id }));
            }
        },
        { 
            Icon: isFavorite ? FaHeart : FaRegHeart, 
            favorite: true, 
            onClick: toggleFavorite 
        }
    ];

    const renderActions = () => (
        <div className={`absolute inset-0 flex items-center justify-${textAlign} gap-3 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0`}>
            {iconsList.map(({ Icon, favorite, onClick }, idx) => {
                return (
                    <Button
                        key={idx}
                        onClick={onClick || ((e) => e.stopPropagation())}
                        width="w-8"
                        height="h-8"
                        bgColor="bg-white"
                        textColor={favorite ? "text-primary" : "text-primary"}
                        outline="border border-primary"
                        hoverBg="hover:bg-primary"
                        hoverText="hover:text-contentBg"
                        rounded="rounded-full"
                        text={<Icon />}
                    />
                )
            })}
        </div>
    );

    if (viewMode === "list") {
        // Dạng cột/horizontal
        return (
            <div
                onClick={handleClick}
                className={`grid grid-cols-12 gap-4 bg-white p-4 cursor-pointer group transition-all duration-200 border-b ${className}`}
            >
                {/* Ảnh bên trái */}
                <div className="col-span-5 h-48 flex items-center justify-center bg-white p-2">
                    <img
                        src={getImageUrl(product.thumbnail)}
                        alt={product.name}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Thông tin bên phải */}
                <div className="col-span-7 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-700 truncate">
                            {product.brand?.name}
                        </h3>
                        <h4 className="text-lg text-gray-700 mt-2 line-clamp-2">
                            {product.name}
                        </h4>
                        {priceText && (
                            <p className="text-red-500 font-semibold mt-2">
                                {formatPrice(product.minPrice) || priceText}₫
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex gap-2">
                        {iconsList.map(({ Icon, favorite, onClick }, idx) => (
                            <Button
                                key={idx}
                                onClick={onClick || ((e) => e.stopPropagation())}
                                width="w-8"
                                height="h-8"
                                bgColor="bg-white"
                                textColor={favorite ? "text-primary" : "text-primary"}
                                outline="border border-primary"
                                hoverBg="hover:bg-primary"
                                hoverText="hover:text-contentBg"
                                rounded="rounded-full"
                                text={<Icon />}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div
            onClick={handleClick}
            className={`relative bg-white transition-all duration-200 cursor-pointer group ${className}`}
        >
            {/* Ảnh sản phẩm */}
            <div className="w-full h-48 bg-white flex items-center justify-center py-2">
                <img
                    src={getImageUrl(product.thumbnail)}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Thông tin sản phẩm */}
            <div className={`p-2 text-${textAlign}`}>
                {/* Tên thương hiệu */}
                <div className="h-6">
                    <h3 className="md:text-base font-bold text-gray-700 truncate" title={product.brand?.name}>
                        {product.brand?.name}
                    </h3>
                </div>

                {/* Tên sản phẩm */}
                <div className="h-9">
                    <h4 className="text-xs text-gray-700 line-clamp-2" title={product.name}>
                        {product.name}
                    </h4>
                </div>

                <div className="relative h-6">
                    {/* Giá (ẩn khi hover) */}
                    {priceText && (
                        <p className="absolute inset-0 text-sm text-red-500 font-semibold truncate transition-all duration-300 group-hover:translate-y-3 group-hover:opacity-0">
                            {priceText}₫
                        </p>
                    )}

                    {/* 3 nút icon (hiện khi hover) */}
                    {renderActions()}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
