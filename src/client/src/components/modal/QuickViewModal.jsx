import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, formatPrice } from '../../utils/index';
import { Button } from '../index';
import { path } from '../../constants/path';
import icons from "../../assets/react-icons/icon";

const {MdCancel} = icons;

Modal.setAppElement('#root');

const QuickViewModal = ({ product: initialProduct, isOpen, onClose }) => {
    const navigate = useNavigate();
    const [product, setProduct] = useState(initialProduct);
    const [previewImage, setPreviewImage] = useState("");
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setProduct(initialProduct);
        setQuantity(1);
    }, [initialProduct]);

    useEffect(() => {
        if (!product) return;

        const thumb = product.images?.find(i => i.isThumbnail) || product.images?.[0];
        setPreviewImage(thumb ? getImageUrl(thumb.url) : getImageUrl(product.thumbnail));

        if (product.variants?.length > 0) {
            const defaultVar = product.variants.find(v => v.isDefault);
            const inStock = product.variants.find(v => v.stockQuantity > 0);
            setSelectedVariant(defaultVar && defaultVar.stockQuantity > 0 ? defaultVar : inStock || product.variants[0]);
        }
    }, [product]);

    const handleQuantityChange = (e) => {
        const value = e.target.value;

        // Cho phép rỗng để user xoá số cũ
        if (value === "") {
            setQuantity("");
            return;
        }
        const num = Number(value);
        const max = selectedVariant?.stockQuantity || 1;
        if (!isNaN(num)) {
            setQuantity(Math.max(1, Math.min(max, num)));
        }
    };

    // Nếu user để trống thì tự trả về 1
    const handleQuantityBlur = () => {
        if (quantity === "" || quantity < 1) {
            setQuantity(1);
        }
    };


    if (!product) return null;

    const sortedImages = product?.images
        ?.slice()
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    const sortedVariants = product?.variants
        ?.slice()
        .sort((a, b) => a.volume - b.volume);

    const selectedInStock = selectedVariant?.stockQuantity > 0;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            //closeTimeoutMS={300}
            className="relative bg-white max-w-5xl w-full mx-4 max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center"
        >
            <MdCancel 
                className="absolute top-4 right-4 z-20 rounded-full flex items-center justify-center text-3xl cursor-pointer hover:text-red-500" 
                onClick={()=>onClose(false)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 p-6">
                {/* === ẢNH === */}
                <div className="space-y-4 lg:col-span-3">
                    <div className="border-4 border-primary rounded-lg overflow-hidden bg-white">
                        <img
                            src={previewImage}
                            alt={product.name}
                            className="w-full h-96 object-contain"
                        />
                    </div>

                    {sortedImages?.length > 0 && (
                        <div className="flex overflow-x-auto gap-3 py-3 justify-center">
                            {sortedImages.map(img => {
                                const imgUrl = getImageUrl(img.url);
                                return (
                                    <div
                                        key={img.id}
                                        onClick={() => setPreviewImage(imgUrl)}
                                        className={`w-14 h-14 rounded cursor-pointer transition     flex-shrink-0 ${
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

                {/* === THÔNG TIN === */}
                <div className="space-y-4 lg:col-span-5">
                    <h1 className="text-2xl font-bold text-gray-900">{product?.name}</h1>
                    <div className='text-sm'>
                        <p>
                            Trạng thái:{' '}
                            <span className={selectedInStock ? "text-green-600" : "text-red-600"}>
                            {selectedInStock ? "Còn hàng" : "Hết hàng"}
                            </span>
                        </p>
                        <p>
                            Hãng sản xuất:{' '}
                            <span className='font-medium text-gray-600'>{product?.brand?.name}</span>
                        </p>
                        <p>
                            Loại sản phẩm:{' '}
                            <span className='font-medium text-gray-600'>{product?.categories?.map(c => c.name).join(", ")}</span>
                        </p>
                    </div>

                    <div className="border-y py-2">
                        {selectedVariant?.discountPercent > 0 ? (
                            <div className="flex items-center gap-4">
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(selectedVariant.originalPrice)}₫
                                </span>
                                <span className="text-2xl font-bold text-red-600">
                                    {formatPrice(selectedVariant.price)}₫
                                </span>
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded">
                                    -{selectedVariant.discountPercent}%
                                </span>
                            </div>
                        ) : (
                            <span className="text-4xl font-bold text-red-600">
                                {formatPrice(selectedVariant?.price)}₫
                            </span>
                        )}
                    </div>

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

                    {/* Dung tích */}
                    {sortedVariants?.length > 1 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold">Dung tích:</h3>
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
                    )}

                    {/*  Input số lượng / thêm vào giỏ */}
                    <div className="flex items-center gap-6">
                        {/* Số lượng input */}
                        <div className="flex items-center gap-3 w-auto">
                            <h3 className="font-semibold">Số lượng</h3>
                            <input
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                onBlur={handleQuantityBlur}
                                min={1}
                                max={selectedVariant?.stockQuantity || 1}
                                className="border rounded text-center w-16 h-10"
                            />
                        </div>
                        <div className='w-1/2'>
                            <Button
                                text={selectedInStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
                                outline='border border-primary'
                                className={selectedInStock ? 'transition-colors duration-200 ease-in-out' : 'pointer-events-none cursor-not-allowed opacity-50'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default QuickViewModal;
