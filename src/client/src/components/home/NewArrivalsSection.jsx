import Slider from "react-slick";
import { CustomArrow, ProductCard } from "../index";
import { SORT_KEYS } from '../../constants/sortKeys'
import { useProducts } from "../../hooks/useProducts";

const NewArrivalsSection = () => {
    const { products } = useProducts({
        page: 1,
        limit: 8,
        sort: SORT_KEYS.LATEST
    });
    if (!products.length) return null;

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
        <div className="w-full">
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
                    <div key={product.id}>
                        <ProductCard product={product} textAlign="center"/>
                    </div>
                ))}
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
                    left: -0px;
                }

                .slick-next {
                    right: -0px;
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
