import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Slider from "react-slick";
import { getImageUrl } from "../../utils";
import { getProductsList } from "../../store/actions/product";
import { CustomArrow } from "../index";

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
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <CustomArrow type="prev"/>,
        nextArrow: <CustomArrow type="next" />,
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
                {products.map(product => {
                    const priceText = product.minPrice != null && product.maxPrice != null
                        ? (product.minPrice !== product.maxPrice
                            ? `${product.minPrice.toLocaleString()} - ${product.maxPrice.toLocaleString()}₫`
                            : `${product.minPrice.toLocaleString()}₫`)
                        : product.price != null
                            ? `${product.price.toLocaleString()}₫`
                            : null;
                    
                    return (
                        <div key={product.id}>
                            <div className="bg-white border hover:shadow-md transition-all duration-200 cursor-pointer">
                                <div className="w-full h-48 bg-white py-2">
                                        <img
                                            src={getImageUrl(product.thumbnail)}
                                            alt={product.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                <div className="p-2 text-center">
                                    <div className="h-6">
                                        <h3 className="text-sm md:text-base font-bold text-gray-700 truncate">
                                            {product.brand?.name}
                                        </h3>
                                    </div>
                                    <div className="h-10">
                                        <h4 className="text-xs text-gray-700 line-clamp-2">
                                            {product.name}
                                        </h4>
                                    </div>
                                    {priceText && (
                                        <div className="h-6"><p className="text-sm text-red-500 font-semibold truncate">{priceText}</p></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Slider>

            {/* Custom slider */}
            <style jsx>{`
                /* Custom arrows */
                .slick-prev,
                .slick-next {
                    z-index: 10;
                    width: 50px;
                    height: 50px;
                    background: transparent !important;
                    border: none;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: 0.6;
                    transition: all 0.3s ease;
                    padding: 0;
                }

                .custom-slick-arrow svg {
                    color: #333;
                    transition: color 0.3s ease;
                }

                .slick-prev:hover svg,
                .slick-next:hover svg {
                    color: #000;
                }

                .slick-prev {
                    left: -35px;
                }

                .slick-next {
                    right: -35px;
                }
                /* Ẩn text mặc định (nếu có) */
                .slick-prev:before,
                .slick-next:before {
                    display: none !important;
                }

                .slick-prev:hover,
                .slick-next:hover {
                    transform: translateY(-50%) translateX(-2px); /* prev */
                }
                .slick-next:hover {
                    transform: translateY(-50%) translateX(2px); /* next */
                }
                /* Cho mũi tên luôn hiện ra ngoài slider */
                .slick-slider {
                    overflow: visible;
                }
            `}</style>
        </div>
    );
};

export default NewArrivalsSection;
