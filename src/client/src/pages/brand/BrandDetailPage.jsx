import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getBrandDetail, getAllBrands } from "../../store/actions/brand";
import { toSlug } from "../../utils";

const BrandDetailPage = () => {
    const { slug } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();

    const { brands, brandDetail } = useSelector(state => state.brand);

    useEffect(() => {
        // ✅ Click từ list (đã có brandId)
        if (location.state?.brandId) {
            dispatch(getBrandDetail(location.state.brandId));
            return;
        }

        // ✅ Reload page
        if (!brands.length) {
            dispatch(getAllBrands());
            return;
        }

        const found = brands.find(
            b => toSlug(b.name) === slug
        );

        if (found) {
            dispatch(getBrandDetail(found.id));
        }
    }, [slug, brands, dispatch]);

    if (!brandDetail) {
        return <div className="container py-10">Loading...</div>;
    }

    return (
        <div className="container bg-contentBg">
            {/* ===== HERO IMAGE ===== */}
            <div className="w-full h-[260px] md:h-[360px] overflow-hidden">
                {brandDetail.posterUrl ? (
                    <img
                        src={brandDetail.posterUrl}
                        alt={brandDetail.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                        {brandDetail.name}
                    </div>
                )}
            </div>

            {/* ===== BRAND INFO ===== */}
            <div className="container py-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    {brandDetail.logoUrl && (
                        <img
                            src={brandDetail.logoUrl}
                            alt={brandDetail.name}
                            className="w-28 h-28 object-contain bg-white p-3 border rounded"
                        />
                    )}

                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {brandDetail.name}
                        </h1>
                        {brandDetail.country && (
                            <p className="text-gray-600">
                                Xuất xứ: <span className="font-medium">{brandDetail.country}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="bg-white p-6 rounded border leading-relaxed text-gray-700">
                    {brandDetail.description ? (
                        <p>{brandDetail.description}</p>
                    ) : (
                        <p>
                            {brandDetail.name} là thương hiệu nước hoa cao cấp,
                            nổi bật với chất lượng hương thơm tinh tế và thiết kế
                            sang trọng, được yêu thích trên toàn thế giới.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandDetailPage;
