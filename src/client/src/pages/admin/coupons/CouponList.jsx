import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    DataTable,
    CrudActions,
    DetailModal,
    InfoModal,
    Pagination,
    Button
} from "../../../components";
import { getAllCouponsAdmin } from "../../../store/actions/coupon";
import { toast } from "react-toastify";
import { apiDeleteCoupon } from "../../../api/coupon";
import { ADMIN_PER_PAGE } from "../../../constants/pagination";
import { formatDateTime, formatPrice } from "../../../utils";
import { useNavigate } from "react-router-dom";
import icons from '../../../assets/react-icons/icon'
import { path } from "../../../constants/path";
const { FaUsers } = icons;

const CouponList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { adminCouponList, loading } = useSelector(state => state.coupon);

    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [mode, setMode] = useState(null); // "view" | "delete"
    const [page, setPage] = useState(1);

    const limit = ADMIN_PER_PAGE;

    useEffect(() => {
        dispatch(getAllCouponsAdmin({ page, limit, hasPagination: true }));
    }, [dispatch, page]);

    const columns = [
        { key: "id", label: "ID", minWidth: "60px", maxWidth: "150px" },
        {
            key: "code",
            label: "Mã coupon",
            render: row => (
                <span className="font-mono text-lg font-bold text-primary">
                    {row.code}
                </span>
            )
        },
        {
            key: "discountType",
            label: "Loại giảm",
            render: row => row.discountType === "fixed" ? "Giảm tiền" : "Giảm %"
        },
        {
            key: "discountValue",
            label: "Giá trị giảm",
            render: row => (
                <span className="font-bold text-green-700">
                    {row.discountType === "fixed"
                        ? `${formatPrice(row.discountValue)}₫`
                        : `${row.discountValue}%`
                    }
                </span>
            )
        },
        {
            key: "status",
            label: "Trạng thái",
            render: row => (
                <span className={row.deletedAt ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                    {row.deletedAt ? "Đã xóa" : "Hoạt động"}
                </span>
            )
        }
    ];

    const handleDelete = async () => {
        try {
            const res = await apiDeleteCoupon(selectedCoupon.id);
            if (res?.err === 0) {
                toast.success("Xóa coupon thành công");
                dispatch(getAllCouponsAdmin({ page, limit, hasPagination: true }));
            } else {
                toast.error(res?.msg || "Xóa thất bại");
            }
        } catch (error) {
            toast.error("Không thể xóa coupon");
        } finally {
            setSelectedCoupon(null);
            setMode(null);
        }
    };

    const actions = [
        CrudActions.view(coupon => {
            setSelectedCoupon(coupon);
            setMode("view");
        }),
        {
            Component: ({ row }) => {
                const disabled = !!row.deletedAt;

                return (
                    <Button
                        text={<FaUsers className="text-lg" />}
                        width="w-10"
                        height="h-8"
                        rounded="rounded-md"
                        bgColor={disabled ? "bg-gray-300" : "bg-indigo-500"}
                        hoverBg={disabled ? "" : "hover:bg-indigo-600"}
                        className={disabled ? "cursor-not-allowed opacity-60" : "text-white"}
                        title={disabled ? "Coupon đã bị xóa" : "Gán cho user"}
                        onClick={() => {
                            if (!disabled) {
                                navigate(
                                    `${path.ADMIN}/${path.COUPON_MANAGER}/${path.ASSIGN.replace(
                                        ":id",
                                        row.id
                                    )}`
                                );
                            }
                        }}
                    />
                );
            }
        },

        CrudActions.softDelete(coupon => {
            setSelectedCoupon(coupon);
            setMode("delete");
        }),
    ];

    return (
        <>
            {/* Bảng danh sách coupon */}
            <DataTable
                columns={columns}
                data={adminCouponList?.data || []}
                actions={actions}
                loading={loading}
            />

            {/* CHI TIẾT COUPON */}
            {selectedCoupon && mode === "view" && (
                <DetailModal
                    open={true}
                    title={`Chi tiết coupon: ${selectedCoupon.code}`}
                    onClose={() => {
                        setSelectedCoupon(null);
                        setMode(null);
                    }}
                >
                    <div className="space-y-3 text-sm">
                        <div><b>ID:</b> {selectedCoupon.id}</div>
                        <div>
                            <b>Mã coupon:</b>{" "}
                            <span className="font-mono text-2xl font-bold text-primary ml-2">
                                {selectedCoupon.code}
                            </span>
                        </div>
                        <div>
                            <b>Loại giảm giá:</b>{" "}
                            {selectedCoupon.discountType === "fixed" ? "Giảm tiền cố định" : "Giảm theo phần trăm"}
                        </div>
                        <div>
                            <b>Giá trị giảm:</b>{" "}
                            <span className="font-bold text-green-700 text-xl">
                                {selectedCoupon.discountType === "fixed"
                                    ? `${formatPrice(selectedCoupon.discountValue)}₫`
                                    : `${selectedCoupon.discountValue}%`
                                }
                            </span>
                        </div>
                        <div><b>Ngày tạo:</b> {formatDateTime(selectedCoupon.createdAt)}</div>
                        <div><b>Cập nhật:</b> {formatDateTime(selectedCoupon.updatedAt)}</div>
                        {selectedCoupon.deletedAt && (
                            <div><b>Ngày xóa:</b> {formatDateTime(selectedCoupon.deletedAt)}</div>
                        )}
                    </div>
                </DetailModal>
            )}

            {/* XÁC NHẬN XÓA */}
            {selectedCoupon && mode === "delete" && (
                <InfoModal
                    icon={<span className="text-red-500 text-4xl">⚠️</span>}
                    message={`Bạn có chắc muốn xóa coupon "${selectedCoupon.code}"?`}
                    showConfirm
                    confirmText="Xóa vĩnh viễn"
                    onConfirm={handleDelete}
                    onClose={() => {
                        setSelectedCoupon(null);
                        setMode(null);
                    }}
                />
            )}

            {/* PHÂN TRANG */}
            <div className="pt-10">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil((adminCouponList?.total || 0) / limit)}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
};

export default CouponList;