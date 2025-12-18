import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyCoupons } from "../../store/actions/coupon";
import { formatPrice, formatDate } from "../../utils/index"

const MyVoucher = () => {
    const dispatch = useDispatch();
    const { coupons } = useSelector(state => state.coupon);

    useEffect(() => {
        dispatch(getMyCoupons());
    }, [dispatch]);

    const unusedCoupons = coupons?.data?.filter(
        item => item.status === "unused"
    ) || [];

    return (
        <div className="text-gray-600">
            <div className="mb-6"><h2 className="text-xl font-medium">VOUCHER CỦA TÔI</h2></div>
            {/* Không có voucher */}
            {unusedCoupons?.length === 0 && (
                <p className="text-gray-500 italic">Bạn chưa có voucher nào.</p>
            )}

            {/* Grid 3 cột */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {unusedCoupons?.data?.map((item) => (
                    <div 
                        key={item.id}
                        className="relative bg-white shadow-sm rounded-xl overflow-hidden border border-dashed border-primary text-center"
                    >
                        {/* Lỗ tròn 2 bên (hiệu ứng ticket) */}
                        <span className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-contentBg w-6 h-6 rounded-full border border-primary"></span>
                        <span className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-contentBg w-6 h-6 rounded-full border border-primary"></span>

                        <div className="p-4">
                            <h3 className="text-lg font-bold">Code: <span className="text-primary">{item.code}</span></h3>
                            <p className="text-gray-600 text-sm mt-1">Giảm {""} 
                                {item.discountType === "percentage"
                                    ? `${formatPrice(item.discountValue)}%`
                                    : `${formatPrice(item.discountValue)}₫`
                                }
                            </p>
                            <p className="text-gray-500 text-xs italic mt-1">
                                HSD: {formatDate(item.validFrom)} - {formatDate(item.validUntil)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyVoucher
