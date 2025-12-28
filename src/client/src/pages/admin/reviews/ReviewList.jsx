import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    DataTable,
    CrudActions,
    DetailModal,
    InfoModal,
    Pagination,
    Button,
} from "../../../components";
import {
    getAllReviewsAdmin,
    getReviewDetailAdmin,
} from "../../../store/actions/review"; // chỉ import 2 cái này
import {
    apiDeleteReviewAdmin,
    apiToggleReviewApproval,
} from "../../../api/review"; // gọi API trực tiếp cho xóa và duyệt
import { toast } from "react-toastify";
import { ADMIN_PER_PAGE } from "../../../constants/pagination";
import { formatDateTime, getImageUrl } from "../../../utils";
import icons from "../../../assets/react-icons/icon";

const { MdCheckCircle, MdBlock } = icons;

const ReviewList = () => {
    const dispatch = useDispatch();
    const { adminReviewList, currentReview } = useSelector(state => state.review);

    const [selectedReview, setSelectedReview] = useState(null);
    const [mode, setMode] = useState(null); // "view" | "delete" | "toggleApproval"
    const [page, setPage] = useState(1);

    const limit = ADMIN_PER_PAGE;
    const hasPagination = true;

    // Chỉ load danh sách bằng Redux
    useEffect(() => {
        dispatch(getAllReviewsAdmin({ page, limit, hasPagination }));
    }, [dispatch, page, limit]);

    // Xử lý xóa mềm - gọi API trực tiếp
    const handleDelete = async () => {
        try {
            const res = await apiDeleteReviewAdmin(selectedReview.id);
            if (res?.err === 0) {
                toast.success("Xóa đánh giá thành công");
                dispatch(getAllReviewsAdmin({ page, limit, hasPagination }))
            } else {
                toast.error(res?.msg || "Xóa đánh giá thất bại");
            }
        } catch {
            toast.error("Không thể xóa đánh giá");
        } finally {
            setSelectedReview(null);
            setMode(null);
        }
    };

    // Xử lý duyệt / ẩn - gọi API trực tiếp
    const handleToggleApproval = async () => {
        const newStatus = !selectedReview.isApproved;
        try {
            const res = await apiToggleReviewApproval(selectedReview.id, newStatus);
            if (res?.err === 0) {
                toast.success(
                    newStatus ? "Đánh giá đã được duyệt" : "Đánh giá đã được ẩn"
                );
                dispatch(getAllReviewsAdmin({ page, limit, hasPagination }))
            } else {
                toast.error(res?.msg || "Cập nhật trạng thái thất bại");
            }
        } catch {
            toast.error("Lỗi khi cập nhật trạng thái duyệt");
        } finally {
            setSelectedReview(null);
            setMode(null);
        }
    };

    const columns = [
        { key: "id", label: "ID", minWidth: "60px", maxWidth: "150px" },
        {
            key: "product",
            label: "Sản phẩm",
            render: (row) => row.orderItem?.variant?.product?.name || "—",
        },
        {
            key: "user",
            label: "Người đánh giá",
            render: (row) =>
                `${row.user?.email || ""}`.trim() || "—",
        },
        { key: "title", label: "Tiêu đề" },
        {
            key: "rating",
            label: "Đánh giá",
            render: (row) => (
                <span className="font-bold text-yellow-600">{row.rating} ★</span>
            ),
        },
        {
            key: "isApproved",
            label: "Trạng thái duyệt",
            render: (row) => (
                <span className={row.isApproved ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {row.isApproved ? "Đã duyệt" : "Đang ẩn"}
                </span>
            ),
        },
        // {
        //     key: "status",
        //     label: "Trạng thái",
        //     render: (row) =>
        //         row.deletedAt ? (
        //             <span className="text-red-500 font-medium">Đã xóa</span>
        //         ) : (
        //             <span className="text-green-600 font-medium">Hoạt động</span>
        //         ),
        // },
    ];

    const actions = [
        // Xem chi tiết - dùng Redux
        CrudActions.view((row) => {
            dispatch(getReviewDetailAdmin(row.id));
            setMode("view");
        }),

        // Duyệt / Ẩn - gọi API trực tiếp
        {
            Component: ({ row }) => {
                const isDeleted = !!row.deletedAt;
                const isApproved = row.isApproved;

                return (
                    <Button
                        text={isApproved ? <MdBlock /> : <MdCheckCircle />}
                        bgColor={
                            isDeleted
                                ? "bg-gray-300"
                                : isApproved
                                    ? "bg-orange-500"
                                    : "bg-green-600"
                        }
                        hoverBg={
                            isDeleted
                                ? ""
                                : isApproved
                                    ? "hover:bg-orange-600"
                                    : "hover:bg-green-700"
                        }
                        width="w-10"
                        height="h-8"
                        rounded="rounded-md"
                        onClick={() => {
                            if (!isDeleted) {
                                setSelectedReview(row);
                                setMode("toggleApproval");
                            }
                        }}
                        className={
                            isDeleted
                                ? "cursor-not-allowed opacity-60"
                                : "text-white"
                        }
                        title={
                            isDeleted
                                ? "Đánh giá đã bị xóa, không thể duyệt/ẩn"
                                : isApproved
                                    ? "Ẩn đánh giá"
                                    : "Duyệt đánh giá"
                        }
                    />
                );
            },
        },

        // Xóa mềm - gọi API trực tiếp
        CrudActions.softDelete((row) => {
            setSelectedReview(row);
            setMode("delete");
        }),
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={adminReviewList?.data || []}
                actions={actions}
                loading={!adminReviewList} // đang load nếu chưa có data
            />

            {/* CHI TIẾT REVIEW - từ Redux */}
            {mode === "view" && currentReview && (
                <DetailModal
                    open
                    title={`Đánh giá #${currentReview.id}`}
                    onClose={() => setMode(null)}
                >
                    <div className="space-y-6 text-sm">
                        <section className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-3">Thông tin đánh giá</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><b>ID:</b> {currentReview.id}</div>
                                <div><b>Rating:</b> <span className="text-2xl text-yellow-600 font-bold">{currentReview.rating} ★</span></div>
                                <div><b>Tiêu đề:</b> {currentReview.title}</div>
                                <div><b>Trạng thái duyệt:</b> {currentReview.isApproved ? "Đã duyệt" : "Đang ẩn"}</div>
                                <div className="col-span-2"><b>Nội dung:</b></div>
                                <div className="col-span-2 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                                    {currentReview.content}
                                </div>
                                <div><b>Ngày tạo:</b> {formatDateTime(currentReview.createdAt)}</div>
                                <div><b>Cập nhật:</b> {formatDateTime(currentReview.updatedAt)}</div>
                                {currentReview.deletedAt && (
                                    <div className="col-span-2 text-red-600">
                                        <b>Đã xóa lúc:</b> {formatDateTime(currentReview.deletedAt)}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-3">Người đánh giá</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><b>Họ tên:</b> {currentReview.user?.firstname} {currentReview.user?.lastname}</div>
                                <div><b>Email:</b> {currentReview.user?.email || "—"}</div>
                            </div>
                        </section>

                        <section className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-3">Sản phẩm được đánh giá</h3>
                            <div className="flex gap-4 items-center">
                                <div>
                                    <p className="font-medium text-lg">
                                        {currentReview.orderItem?.variant?.product?.name || "—"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {currentReview.reviewImages?.length > 0 && (
                            <section>
                                <h3 className="font-semibold text-lg mb-3">
                                    Ảnh đánh giá ({currentReview.reviewImages.length})
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {currentReview.reviewImages.map((img) => (
                                        <img
                                            key={img.id}
                                            src={getImageUrl(img.url)}
                                            alt="Review"
                                            className="w-full h-48 object-cover rounded-lg border"
                                            onError={(e) => (e.target.src = "/placeholder.jpg")}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </DetailModal>
            )}

            {/* CONFIRM XÓA */}
            {mode === "delete" && selectedReview && (
                <InfoModal
                    icon={<span className="text-red-500 text-4xl">⚠️</span>}
                    message={`Bạn có chắc muốn xóa đánh giá "${selectedReview.title}" của "${selectedReview.user?.firstname} ${selectedReview.user?.lastname}"?`}
                    showConfirm
                    onConfirm={handleDelete}
                    onClose={() => {
                        setSelectedReview(null);
                        setMode(null);
                    }}
                />
            )}

            {/* CONFIRM DUYỆT / ẨN */}
            {mode === "toggleApproval" && selectedReview && (
                <InfoModal
                    title={selectedReview.isApproved ? "Ẩn đánh giá" : "Duyệt đánh giá"}
                    message={
                        <div className="text-center space-y-3">
                            <p>
                                Bạn có chắc muốn{" "}
                                <b className={selectedReview.isApproved ? "text-orange-600" : "text-green-600"}>
                                    {selectedReview.isApproved ? "ẨN" : "DUYỆT"}
                                </b>{" "}
                                đánh giá này?
                            </p>
                            <p className="font-medium">"{selectedReview.title}"</p>
                            <p className="text-sm text-gray-600">
                                Người đánh giá: {selectedReview.user?.firstname} {selectedReview.user?.lastname}
                            </p>
                        </div>
                    }
                    showConfirm
                    confirmText={selectedReview.isApproved ? "Ẩn ngay" : "Duyệt ngay"}
                    onConfirm={handleToggleApproval}
                    onClose={() => {
                        setSelectedReview(null);
                        setMode(null);
                    }}
                />
            )}

            {/* PHÂN TRANG */}
            <div className="pt-10">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil((adminReviewList?.total || 0) / limit)}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
};

export default ReviewList;