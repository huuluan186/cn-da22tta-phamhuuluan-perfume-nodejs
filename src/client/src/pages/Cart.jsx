import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCart } from "../store/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/index"
import { formatPrice, getImageUrl } from "../utils/index";
import { apiUpdateQuantity, apiDeleteACartItems, apiClearCart } from "../api/cart";
import { path } from "../constants/path";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector(state => state.cart); 

    useEffect(() => {
        dispatch(getMyCart());
    }, [dispatch]);

    const handleQuantityChange = async (item, delta) => {
        const newQty = Math.max(1, item.quantity + delta);
        try {
            await apiUpdateQuantity(item.id, { quantity: newQty }); // gọi API
            dispatch(getMyCart()); // cập nhật lại state cart
        } catch (error) {
            console.error("Cập nhật số lượng lỗi:", error);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await apiDeleteACartItems(itemId); // xóa 1 sản phẩm
            dispatch(getMyCart());
        } catch (error) {
            console.error("Xóa sản phẩm lỗi:", error);
        }
    };

    const handleClearCart = async () => {
        try {
            await apiClearCart(); // xóa toàn bộ giỏ
            dispatch(getMyCart());
        } catch (error) {
            console.error("Xóa toàn bộ giỏ hàng lỗi:", error);
        }
    };

    const subtotal = cart?.cartItems?.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0) || 0;

    const subItems = cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div className="container py-6 bg-contentBg">
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng</h1>
            <div className="flex items-center mb-5 gap-8">
                <p className="text-sm text-gray-500">({subItems} sản phẩm)</p>
                <Button 
                    text='Xóa giỏ hàng'
                    width="w-auto"
                    height="h-8"
                    textSize="text-sm font-medium"
                    outline="border border-primary"
                    onClick={handleClearCart}
                />
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Danh sách sản phẩm */}
                <div className="col-span-9">
                    {(!cart?.cartItems || cart.cartItems.length === 0) && (
                        <p>Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tiếp tục mua hàng</p>
                    )}
                    {cart?.cartItems?.map(item => {
                        const variant = item.productVariant;
                        const product = variant.product;
                        const [thumb] = product.images 
                        const stock = item.productVariant.stockQuantity;
                        const isMax = item.quantity >= stock;
                        const isMin = item.quantity <= 1;
                        return (
                            <div key={item.id} className="grid grid-cols-12 border-y py-5 gap-4">
                                {/* 1. Thông tin sản phẩm + ảnh */}
                                <div className="col-span-6 flex gap-4">
                                    <img src={getImageUrl(thumb.url)} alt={product.name} className="w-24 h-24 object-contain mr-4" />
                                    <div className="flex-1">
                                        <h2 className="font-bold">{product.brand.name.toUpperCase()}</h2>
                                        <p className="text-gray-600">{product.name}</p>
                                        <p className="text-gray-500 text-sm">Mã hàng: {variant.sku}</p>
                                        <p className="text-gray-500 text-sm">{variant.volume}ml</p>
                                    </div>
                                </div>
                                {/* 2. Giá */}
                                <div className="col-span-3 text-red-600 font-bold text-lg">
                                    <span className="text-red-600 font-bold text-lg">{formatPrice(variant.price)}₫</span>
                                </div>
                                {/* 3. Số lượng */}
                                <div className="col-span-2 flex items-start">
                                    <Button 
                                        text="−" 
                                        onClick={isMin ? undefined : () => handleQuantityChange(item, -1)}  
                                        width="w-8" 
                                        height="h-8"
                                        bgColor="bg-white"
                                        textColor={isMin ? "text-gray-400" : "text-gray-700"}
                                        hoverText={isMin ? "" : "hover:text-white"}
                                        hoverBg={isMin ? "" : "hover:bg-primary"}
                                        outline="border"
                                        className={isMin ? "cursor-not-allowed opacity-50" : ""}
                                    />
                                    <Button
                                        text={item.quantity}
                                        width="w-8"
                                        height="h-8"
                                        bgColor="bg-white"
                                        textColor="text-gray-700"
                                        hoverBg="hover:none"
                                        outline='border'
                                        className="cursor-default pointer-events-none select-none"
                                    />
                                    <Button 
                                        text="+" 
                                        onClick={isMax ? undefined : () => handleQuantityChange(item, 1)} 
                                        width="w-8" 
                                        height="h-8"
                                        bgColor="bg-white"
                                        textColor={isMax ? "text-gray-400" : "text-gray-700"}
                                        hoverText={isMax ? "" : "hover:text-white"}
                                        hoverBg={isMax ? "" : "hover:bg-primary"}
                                        outline="border"
                                        className={isMax ? "cursor-not-allowed opacity-50" : ""}
                                    />
                                </div>
                                {/* 4. Nút X */}
                                <div className="col-span-1 text-right">
                                    <Button
                                        text='X'
                                        textColor="text-gray-400"
                                        hoverText="hover:text-red-500"
                                        bgColor="bg-none"
                                        hoverBg="hover:none"
                                        onClick={() => handleRemove(item.id)}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Summary */}
                <div className="col-span-3 border p-4 h-fit">
                    <div className="flex justify-between mb-2">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(subtotal)}₫</span>
                    </div>
                    <div className="flex justify-between font-bold text-red-600 text-lg mb-4">
                        <span>Tổng:</span>
                        <span>{formatPrice(subtotal)}₫</span>
                    </div>
                    <div className="space-y-3">
                        <Button 
                            text="Thanh toán" 
                            width="w-full" 
                            height="h-12"
                            hoverBg="hover:bg-primary/80" 
                            hoverText="hover:none"
                            outline='rounded-lg'
                            onClick={()=>navigate(path.CHECKOUT)}
                        />
                        <Button 
                            text="Tiếp tục mua hàng" 
                            width="w-full" 
                            height="h-12" 
                            textColor="text-black"
                            bgColor="bg-contentBg"
                            hoverBg="hover:none" 
                            hoverText="hover:text-primary"
                            outline='border border-black hover:border-primary rounded-lg'
                            onClick={()=>navigate(`${path.COLLECTIONS}/${path.ALL_PRODUCTS}`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;
