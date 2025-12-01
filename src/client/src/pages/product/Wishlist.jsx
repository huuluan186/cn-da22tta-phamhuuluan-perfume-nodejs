import { apiGetMyFavorites } from "../../api/user"
import { useEffect, useState } from "react"
import { ProductCard,  } from "../../components"

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

    return (
        <div className='container py-6 bg-contentBg'>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Wishlist
