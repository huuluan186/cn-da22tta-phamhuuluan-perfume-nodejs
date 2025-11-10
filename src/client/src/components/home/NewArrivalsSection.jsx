import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Slider from "react-slick";
import { getImageUrl } from "../../utils";
import { getProductsList } from "../../store/actions/product";
const NewArrivalsSection = () => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.product);

    // Lấy 8 sản phẩm mới nhất
    useEffect(() => {
        dispatch(getProductsList({ page: 1, limit: 8, sort: "latest" }));
    }, [dispatch]);

    // Config slider: hiển thị 6 sp 1 dòng, có 2 mũi tên
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5 } },
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 640, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    if (!products || !products.length) return null; // nếu chưa có data

    return (
        <div className="w-full mb-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl text-gray-700 font-medium cursor-pointer">
                    New Arrivals
                </h2>
                <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    Xem thêm
                    <span className="text-lg">›</span>
                </button>
            </div>

            {/* Slider */}
            <Slider {...settings}>
                {products.map(product => (
                    <div key={product.id} className="p-2">
                        <div className="bg-white border hover:shadow-md transition-all duration-200 cursor-pointer">
                            <img
                                src={getImageUrl(product.thumbnail)}
                                alt={product.name}
                                className="w-full h-40 object-contain p-4"
                            />
                            <div className="p-2">
                                <h3 className="text-sm md:text-base font-medium text-gray-700">
                                    {product.name}
                                </h3>
                                {product.minPrice && product.maxPrice ? (
                                    <p className="text-sm text-gray-500">
                                        {product.minPrice !== product.maxPrice
                                            ? `${product.minPrice.toLocaleString()} - ${product.maxPrice.toLocaleString()} VND`
                                            : `${product.minPrice.toLocaleString()} VND`}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default NewArrivalsSection;
