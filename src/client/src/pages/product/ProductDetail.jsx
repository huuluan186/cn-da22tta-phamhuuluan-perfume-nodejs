import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { getProductDetail, getProductsList, getProductReviews  } from "../../store/actions/product";
import { toSlug } from "../../utils";
import { getImageUrl, formatPrice } from "../../utils";
import { Button, ProductTabs, RatingSummary, ReviewList, ReviewModal, Modal } from '../../components/index'
import icons from "../../assets/react-icons/icon";
import { apiAddFavorite, apiRemoveFavorite, apiGetMyFavorites } from "../../api/user";

const { FaHeart, FaRegHeart, FaRegCheckCircle} = icons;

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const { products, product, reviews, avgRating, totalReviews } = useSelector(state => state.product);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [reloadReview, setReloadReview] = useState(false); // tín hiệu khi thêm bình luận xong
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // 1. Nếu products chưa load, gọi API danh sách sản phẩm
    useEffect(() => {
        if (products.length === 0) {
            dispatch(getProductsList());
        }
    }, [products.length, dispatch]);

    // 2. Khi products có sẵn, tìm productId từ slug
    useEffect(() => {
        if (products.length > 0 && slug) {
            const matchedProduct = products.find(p => toSlug(p.name) === slug);
            if (matchedProduct) setCurrentProductId(matchedProduct.id);
        }
    }, [products, slug]);

    // 3. Khi có productId, gọi API chi tiết
    useEffect(() => {
        if (currentProductId) {
            dispatch(getProductDetail(currentProductId));
        }
    }, [currentProductId, dispatch]);

    // Cập nhật ảnh preview khi product thay đổi
    useEffect(() => {
        if (product?.images?.length > 0) {
            const thumb = product.images.find(i => i.isThumbnail);
            setPreviewImage(getImageUrl(thumb?.url));
        }
    }, [product]);

    // Chọn variant hợp lệ: ưu tiên isDefault → còn hàng → cái đầu tiên
    useEffect(() => {
        if (product?.variants?.length > 0) {
            const defaultVariant = product.variants.find(v => v.isDefault);
            const availableVariant = product.variants.find(v => v.stockQuantity > 0);

            if (defaultVariant && defaultVariant.stockQuantity > 0) {
                setSelectedVariant(defaultVariant);
            } else if (availableVariant) {
                setSelectedVariant(availableVariant);
            } else {
                setSelectedVariant(product.variants[0]); // tất cả hết → vẫn chọn 1 cái để hiển thị
            }
        }
    }, [product]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!currentProductId) return;
            try {
                const res = await apiGetMyFavorites();
                if (res?.data?.err === 0) {
                    const favIds = res.data.response?.map(p => p.productId);
                    setIsFavorite(favIds.includes(currentProductId));
                }
            } catch (err) {
                console.error("Lỗi wishlist:", err);
            }
        };
        fetchWishlist();
    }, [currentProductId]);

    useEffect(() => {
        if (currentProductId) {
            dispatch(getProductReviews(currentProductId));
        }
    }, [currentProductId, dispatch, reloadReview]);

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await apiRemoveFavorite(currentProductId);
                setIsFavorite(false);
            } else {
                await apiAddFavorite(currentProductId);
                setIsFavorite(true);
            }

            window.dispatchEvent(new Event("favoritesUpdated"));
        } catch (err) {
            console.error("Lỗi toggle favorite:", err);
        }
    };

    // Variant đang chọn có còn hàng không?
    const selectedInStock = selectedVariant?.stockQuantity > 0;

    const handleQuantityChange = (delta) => {
        const max = selectedVariant?.stockQuantity || 1;
        setQuantity(prev => Math.max(1, Math.min(max, prev + delta)));
    };

    // sort ảnh theo sortOrder
    const sortedImages = product?.images
        ?.slice()
        .sort((a, b) => a.sortOrder - b.sortOrder);

    // sort variant theo thứ tự volume tăng dần
    const sortedVariants = product?.variants
    ?.slice()
    .sort((a, b) => a.volume - b.volume);

    return (
        <div className="container py-6 bg-contentBg">
            {/* ================== KHỐI 1: THÔNG TIN SẢN PHẨM ================== */}
            <div className="border shadow-sm">
                <div className="grid grid-cols-12 lg:grid-cols-12 gap-10">
                    <div className="col-span-5 p-4">
                         {/* Ảnh lớn */}
                        <div className="w-full border-4 border-primary rounded">
                            <img 
                                src={previewImage}
                                alt={product?.name}
                                className="w-full h-96 object-contain"
                            />
                        </div>
                        {/* Slider ảnh nhỏ */}
                        {sortedImages?.length > 0 && (
                            <div className="flex overflow-x-auto gap-3 py-3 justify-center">
                                {sortedImages.map(img => {
                                    const imgUrl = getImageUrl(img.url);
                                    return (
                                        <div
                                            key={img.id}
                                            onClick={() => setPreviewImage(imgUrl)}
                                            className={`w-14 h-14 rounded cursor-pointer transition flex-shrink-0 ${
                                                previewImage === imgUrl && "border border-black"
                                            }`}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt="thumb"
                                                className="w-full h-full object-contain rounded"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="col-span-7 p-4">
                        {/* Tên sản phẩm */}
                        <h1 className="text-2xl font-bold text-gray-900">{product?.name}</h1>

                        {/* Hiển thị rating và lượt đánh giá */}
                        <div className="flex items-center font-bold gap-1 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => {
                                const starNumber = i + 1;
                                const filled = starNumber <= Math.round(Number(avgRating || 0));
                                return (
                                    <span key={i} className={filled ? "text-yellow-400" : "text-gray-300"}>★</span>
                                );
                            })}
                            <span className="text-gray-600 text-sm">
                                ({totalReviews || 0} đánh giá)
                            </span>
                        </div>

                        {/* Tình trạng tổng: còn hàng nếu có ít nhất 1 variant còn */}
                        <p className="font-medium text-gray-600 my-2">
                            Tình trạng:
                            <span className={`font-bold ${selectedInStock ? "text-green-600" : "text-red-600"}`}>
                                {selectedInStock ? " Còn hàng" : " Hết hàng"} •
                            </span>
                        </p>

                        {/* Giá */}
                        <div className="mb-3">
                            {selectedVariant?.discountPercent > 0 ? (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 line-through text-lg">
                                            {formatPrice(selectedVariant.originalPrice)}₫
                                        </span>
    
                                        <span className="text-primary text-2xl font-bold">
                                            {formatPrice(selectedVariant.price)}₫
                                        </span>
                                        
                                        <span className="text-base">
                                            (Tiết kiệm {selectedVariant.discountPercent}%)
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-primary text-2xl font-bold">
                                    {formatPrice(selectedVariant?.price)}₫
                                </span>
                            )}
                        </div>

                        {/* Thuộc giới tính */}
                        {product?.gender && (
                            <div className="mb-4 space-y-1">
                                <span className="font-semibold text-gray-800">Giới tính</span>
                                <div className="flex flex-col items-start justify-center">
                                    <Button
                                        text={(product.gender).toUpperCase()}
                                        width="w-auto"
                                        height="h-auto"
                                        textSize="font-normal text-sm"
                                        bgColor="bg-contentBg"
                                        textColor="text-gray-800"
                                        outline='border border-primary'
                                        hoverText="hover:none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Xuất xứ */}
                        {product?.origin && (
                            <div className="mb-4 space-y-1">
                                <span className="font-semibold text-gray-800">Xuất xứ</span>
                                <div className="flex flex-wrap items-start gap-2">
                                    {product.origin.split(",").map((country, index) => (
                                        <Button
                                            key={index}
                                            text={country.trim().toUpperCase()}
                                            width="w-auto"
                                            height="h-auto"
                                            textSize="font-normal text-sm"
                                            bgColor="bg-contentBg"
                                            textColor="text-gray-800"
                                            outline="border border-primary"
                                            hoverText="hover:none"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Các dung tích */}
                        <div className="mb-4 space-y-1">
                            <h3 className="font-semibold text-gray-800">Dung tích</h3>
                            <div className="flex flex-wrap gap-3">
                                {sortedVariants?.map(v => {
                                    const isOutOfStock = v.stockQuantity === 0;
                                    const isSelected = selectedVariant?.id === v.id;
    
                                    let bgColor = isSelected ? "bg-white" : "bg-white";
                                    let textColor = isSelected ? "text-primary" : "text-gray-00";
                                    let hoverText
                                    let textSize = isSelected ? "font-medium text-sm" : "font-normal text-sm";
                                    let outline = isSelected ? "border border-primary" : "border border-gray-300";

                                    // Luôn cho click, kể cả hết hàng
                                    const handleVariantClick = () => setSelectedVariant(v);
    
                                    if (isOutOfStock) {
                                        bgColor = "bg-gray-50";
                                        textColor = "text-gray-400";
                                        hoverText = "hover:none"
                                        outline = "border border-dashed border-gray-400";
                                    }
    
                                    return (
                                        <div key={v.id} className="relative">
                                            <Button
                                                text={`${v.volume}ml${isOutOfStock ? " (Hết hàng)" : ""}`}
                                                onClick={handleVariantClick}
                                                width="w-auto"
                                                height="h-auto"
                                                textSize={textSize}
                                                bgColor={bgColor}
                                                textColor={textColor}
                                                outline={outline}
                                                hoverBg='hover:none'
                                                hoverText={hoverText}
                                            />
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-full h-px bg-gray-400 rotate-12"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tăng - giảm số lượng mua */}
                        <div className="mb-4 space-y-1">
                            <h3 className="font-semibold text-gray-800">Số lượng</h3>
                            <div className="inline-flex items-center justify-center text-lg">
                                <Button
                                    text="−"
                                    onClick={() => handleQuantityChange(-1)}
                                    //disabled={!selectedInStock}
                                    width="w-auto"
                                    height="h-auto"
                                    bgColor="bg-white"
                                    textColor="text-gray-700"
                                    hoverText="hover:text-white"
                                    hoverBg="hover:bg-primary"
                                    outline='border'
                                />
                                <Button
                                    text={quantity}
                                    onClick={() => handleQuantityChange(-1)}
                                    //disabled={!selectedInStock}
                                    width="w-16"
                                    height="h-auto"
                                    bgColor="bg-white"
                                    textColor="text-gray-700"
                                    hoverBg="hover:none"
                                    outline='border'
                                />
                                <Button
                                    text="+"
                                    onClick={() => handleQuantityChange(1)}
                                    //disabled={!selectedInStock || quantity >= (selectedVariant?.stockQuantity || 0)}
                                    width="w-auto"
                                    height="h-auto"
                                    bgColor="bg-white"
                                    textColor="text-gray-700"
                                    hoverText="hover:text-white"
                                    hoverBg="hover:bg-primary"
                                    outline='border'
                                />
                            </div>
                            {selectedInStock && selectedVariant?.stockQuantity < 10 && (
                                <p className="text-sm text-orange-600 mt-2">
                                    Chỉ còn {selectedVariant.stockQuantity} sản phẩm!
                                </p>
                            )}
                        </div>
                            
                        {/* NÚT MUA - THÊM */}
                        <div className="grid grid-cols-2 gap-4 w-full mb-4">
                            { selectedInStock ? (
                                <>
                                    <Button 
                                        text='MUA NGAY'
                                        width="w-full"
                                        height="h-14"
                                        rounded="rounded-md"
                                        textSize="text-xl"
                                        hoverBg="hover:bg-secondary"
                                        hoverText="hover:text-light"
                                    />
                                    <Button 
                                        text='THÊM VÀO GIỎ HÀNG'
                                        width="w-full"
                                        height="h-14"
                                        rounded="rounded-md"
                                        textSize="text-xl"
                                        hoverBg="hover:bg-secondary"
                                        hoverText="hover:text-light"
                                    />
                                </>
                            ) : (
                                <Button 
                                    text='HẾT HÀNG'
                                    width="w-full"
                                    height="h-14"
                                    rounded="rounded-md"
                                    textSize="text-xl"
                                    className="pointer-events-none cursor-not-allowed opacity-50"
                                />
                            )}
                        </div>

                        {/* YÊU THÍCH */}
                        <div className="inline-flex items-center justify-center">
                            <Button
                                onClick={toggleFavorite}
                                text={isFavorite ? <FaHeart/> : <FaRegHeart/>}
                                width="w-auto"
                                height="h-10"
                                textSize="text-lg"
                                bgColor="bg-white"
                                textColor={isFavorite ? "text-primary" : "text-gray-400"}
                                outline="border"
                                hoverBg="hover:none"
                                hoverText="hover:none"
                            />
                            <Button
                                onClick={toggleFavorite}
                                text={isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
                                width="w-auto"
                                height="h-10"
                                textSize="font-normal text-sm"
                                bgColor="bg-white"
                                textColor="text-gray-800"
                                outline="border"
                                hoverBg="hover:none"
                                hoverText="hover:text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================== KHỐI 2: 3 TAB CHI TIẾT ================== */}
            <div className="border shadow-sm mt-8">
                <ProductTabs product={product} selectedVariant={selectedVariant}/> 
            </div>

            {/* ================== KHỐI 3: ĐÁNH GIÁ SẢN PHẨM ================== */}
            <div className="mt-8 space-y-6">
                <h3 className="text-2xl font-bold bg-gray-200 px-4 py-2 -mb-2 rounded-md">
                    Đánh giá và Nhận xét ({totalReviews})
                </h3>
                <RatingSummary
                    avgRating={avgRating}
                    totalReviews={totalReviews}
                    reviews={reviews} 
                    onRateClick={()=>setOpenModal(true)}
                />

                <ReviewList reviews={reviews} />
            </div>

            {/* review modal */}
            {openModal && (
                <ReviewModal 
                    product={product} 
                    onClose={() => {
                        setOpenModal(false);           // Đóng ReviewModal
                        setShowSuccessModal(true);    // Hiện modal thành công
                    }} 
                />
            )}

            {/* Modal thông báo thành công */}
            {showSuccessModal && (
                <Modal
                    icon={<FaRegCheckCircle size={50} className="text-primary" />}
                    message="Cảm ơn bạn đã để lại đánh giá!"
                    onClose={() => {
                        setShowSuccessModal(false);
                        setReloadReview(prev => !prev); // Reload lại review
                    }}
                    autoClose={2000}
                />
            )}
        </div>
    )
}

export default ProductDetail
