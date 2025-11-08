import brand_banner_1 from '../../assets/images/banners/banner_brand_image_section_01.jpg'
import brand_banner_2 from '../../assets/images/banners/banner_brand_image_section_02.jpg'
import brand_banner_3 from '../../assets/images/banners/banner_brand_image_section_03.jpg'
import { useSelector } from 'react-redux'
import { BannerSlider } from '../index'

const BrandSection = () => {
    const { brands } = useSelector(state => state.brand);

    const brandBanners = [
        { id: 1, img: brand_banner_1, alt: "Banner"},
        { id: 2, img: brand_banner_2, alt: "Banner"},
        { id: 3, img: brand_banner_3, alt: "Banner"},
    ];

    return (
        <div className='w-full'>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl text-gray-700 font-medium cursor-pointer">
                    Thương hiệu
                </h2>
                <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    Xem thêm
                    <span className="text-lg">›</span>
                </button>
            </div>

            {/* layout chính*/}
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch h-full">
                {/* Slide banner bên trái (ẩn khi nhỏ hơn lg) */}
                <div className='hidden lg:block w-full h-full overflow-hidden'>
                    <BannerSlider
                        slides={brandBanners}
                        showDots={false}
                        autoplay={true}
                        showArrows={false}
                    />
                </div>

                {/* Grid thương hiệu bên phải */}
                <div className="h-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4">
                    {brands?.slice(0, 16).map((brand) => (
                        <div 
                            key={brand.id}
                            className='flex justify-center items-center border bg-white hover:shadow-md transition-all duration-200 cursor-pointer'
                        >
                            <img
                                src={brand.logoUrl}
                                alt={brand.name}
                                className="max-h-10 object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BrandSection
