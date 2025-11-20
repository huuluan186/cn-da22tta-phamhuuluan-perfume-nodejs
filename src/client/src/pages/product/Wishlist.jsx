import { apiGetMyFavorites, apiRemoveFavorite } from "../../api/user"
import { useEffect, useState } from "react"
import { ProductCard, Button } from "../../components"
import icons from '../../assets/react-icons/icon'

const { FaTrashAlt } = icons

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiGetMyFavorites();
                if (res?.data?.err === 0) {
                    const formatted = res.data.response?.map(item => ({
                        id : item.productId,
                        name: item.productName,
                        ...item,
                    }))
                    setWishlist(formatted);
                }
            } catch (error) {
                console.error("Error loading wishlist:", error);
            }
        };

        fetchData();
    }, []);

    const handleRemove = async (productId) => {
        try {
            // Gọi API xóa nếu có
            await apiRemoveFavorite(productId);
            // Cập nhật state để remove thẳng UI
            setWishlist(prev => prev.filter(item => item.id !== productId));
            window.dispatchEvent(new Event('favoritesUpdated'));
        } catch (error) {
            console.error("Error removing product:", error);
        }
    };

    return (
        <div className='container py-6'>
            <h2 className="text-2xl font-semibold mb-6">Sản Phẩm Yêu Thích</h2>
            {wishlist.length === 0 ? (
                <div className="text-gray-500">
                    <p className="text-lg">Bạn chưa có sản phẩm yêu thích nào.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {wishlist.map(product => (
                        <div key={product.id} className="relative group">
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                className='border'
                                textAlign="center"
                                onRemove={(id) => setWishlist(prev => prev.filter(p => p.id !== id))}
                            />
                            <div className="absolute bottom-1 right-2">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation(); // tránh click vào card
                                        handleRemove(product.id);
                                    }}
                                    width="w-8"
                                    height="h-8"
                                    bgColor="bg-white"
                                    hoverBg="hover:none"
                                    textColor="text-bl"
                                    rounded="rounded-full"
                                    text={<FaTrashAlt />}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Wishlist
