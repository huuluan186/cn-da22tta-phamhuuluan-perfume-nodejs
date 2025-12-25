import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable, DetailModal, InfoModal, Pagination, Button } from "../../../components";
import { getAllOrdersAdmin, getOrderDetailAdmin, confirmOrderAdmin } from "../../../store/actions/order";
import { toast } from "react-toastify";
import { ADMIN_PER_PAGE } from "../../../constants/pagination";
import { formatDateTime, formatPrice, getImageUrl } from "../../../utils";
import icons from "../../../assets/react-icons/icon";

const { FiEye, GiConfirmed } = icons;

const OrderList = () => {
    const dispatch = useDispatch();
    const { adminOrderList, currentOrder } = useSelector(state => state.order);

    const [mode, setMode] = useState(null); // "view" | "confirm"
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [page, setPage] = useState(1);

    const limit = ADMIN_PER_PAGE;

    useEffect(() => {
        dispatch(getAllOrdersAdmin({ page, limit, hasPagination: true }));
    }, [dispatch, page]);

    // Render trạng thái đẹp
    const renderStatus = (status) => {
        const config = {
            Pending: { color: "text-yellow-800", text: "Chờ xác nhận" },
            Confirmed: { color: "text-blue-800", text: "Đã xác nhận" },
            Processing: { color: "text-purple-800", text: "Đang xử lý" },
            Shipped: { color: "text-indigo-800", text: "Đang giao" },
            Completed: { color: "text-green-800", text: "Hoàn thành" },
            Cancelled: { color: "text-red-800", text: "Đã hủy" },
        };
        const cfg = config[status] || { color: "text-gray-800", text: status };
        return <span className={`text-justify rounded-full text-xs font-medium ${cfg.color}`}>{cfg.text}</span>;
    };

    const renderPaymentMethod = (method) => method === "COD" ? "COD" : "ZaloPay";

    const columns = [
        { key: "id", label: "Mã đơn" },
        { key: "createdAt", label: "Ngày đặt", render: r => formatDateTime(r.createdAt) },
        { key: "totalAmount", label: "Tổng tiền", render: r => <span className="font-bold text-green-700">{Number(r.totalAmount).toLocaleString("vi-VN")}₫</span> },
        { key: "orderStatus", label: "Trạng thái", render: r => renderStatus(r.orderStatus) },
        { key: "paymentStatus", label: "Thanh toán", render: r => renderStatus(r.paymentStatus === "Paid" ? "Paid" : r.paymentStatus) },
        { key: "paymentMethod", label: "PTTT", render: r => renderPaymentMethod(r.paymentMethod) },
        { key: "orderItems", label: "SP", render: r => r.orderItems?.length || 0 },
    ];

    // === ACTIONS: Chỉ 2 nút – dùng Button component chuẩn ===
    const actions = [
        // Xem chi tiết
        {
            Component: ({ row }) => (
                <Button
                    text={<FiEye />}
                    bgColor="bg-blue-500"
                    hoverBg="hover:bg-blue-600"
                    width="w-10"
                    height="h-8"
                    rounded="rounded-md"
                    onClick={() => {
                        dispatch(getOrderDetailAdmin(row.id));
                        setMode("view");
                    }}
                    className="text-white"
                />
            )
        },
        // Xác nhận đơn hàng – chỉ khi Pending
        {
            Component: ({ row }) => {
                const isConfirmable = row.orderStatus === "Pending" || row.orderStatus === "Processing";

                return (
                    <Button
                        text="Duyệt"
                        bgColor={isConfirmable ? "bg-green-600" : "bg-gray-400"}
                        hoverBg={isConfirmable ? "hover:bg-green-700" : ""}
                        width="w-auto"
                        height="h-8"
                        rounded="rounded-md"
                        textColor="text-white"
                        textSize="text-sm"
                        onClick={() => {
                            if (isConfirmable) {
                                setSelectedOrder(row);
                                setMode("confirm");
                            }
                        }}
                        className={isConfirmable ? "px-3" : "px-3 cursor-not-allowed opacity-70"}
                        IcBefore={GiConfirmed}
                    />
                );
            }
        }
    ];

    // Xử lý xác nhận đơn
    const handleConfirm = async () => {
        try {
            const currentParams = { page, limit, hasPagination: true };
            // Gọi action và chờ kết quả (vì action trả về promise)
            const res = await dispatch(confirmOrderAdmin(selectedOrder.id, currentParams));
            console.log("confirm", res)
            // Action của em trả về res từ API → kiểm tra err
            if (res?.err === 0) {
                toast.success(res.msg || "Đơn hàng đã được xác nhận thành công!");
            } else {
                toast.error(res?.msg || "Xác nhận đơn hàng thất bại");
            }
        } catch (error) {
            toast.error("Lỗi kết nối server");
        } finally {
            // Đóng modal dù thành công hay thất bại
            setMode(null);
            setSelectedOrder(null);
        }
    };

    return (
        <>
            <DataTable
                columns={columns}
                data={adminOrderList?.data || []}
                actions={actions}
            />

            {/* CHI TIẾT ĐƠN HÀNG – GIỮ NGUYÊN HOÀN TOÀN NHƯ CŨ */}
            {mode === "view" && currentOrder && (
                <DetailModal
                    open
                    title={`Đơn hàng #${currentOrder.id}`}
                    onClose={() => setMode(null)}
                >
                    <div className="space-y-6 text-sm">
                        {/* THÔNG TIN CHUNG */}
                        <section className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-3">Thông tin chung</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><b>Mã đơn:</b> {currentOrder.id}</div>
                                <div><b>User ID:</b> <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{currentOrder.userId}</span></div>

                                <div><b>Ngày tạo:</b> {formatDateTime(currentOrder.createdAt)}</div>
                                <div><b>Ngày cập nhật:</b> {formatDateTime(currentOrder.updatedAt)}</div>

                                <div><b>Tổng tiền:</b> <span className="font-bold text-green-600">{Number(currentOrder.totalAmount).toLocaleString("vi-VN")}₫</span></div>
                                <div><b>Phí vận chuyển:</b> <span className="font-medium text-orange-600">{Number(currentOrder.shippingFee || 0).toLocaleString("vi-VN")}₫</span></div>

                                <div><b>Trạng thái đơn:</b> {renderStatus(currentOrder.orderStatus)}</div>
                                <div><b>Thanh toán:</b> {renderStatus(currentOrder.paymentStatus === "Paid" ? "Paid" : currentOrder.paymentStatus)}</div>

                                <div><b>Phương thức:</b> {renderPaymentMethod(currentOrder.paymentMethod)}</div>
                                {currentOrder.expiresAt && (
                                    <div><b>Hết hạn thanh toán:</b> {formatDateTime(currentOrder.expiresAt)}</div>
                                )}

                                {currentOrder.paymentTransactionId && (
                                    <div className="col-span-2">
                                        <b>Mã giao dịch ZaloPay:</b>
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded ml-2">
                                            {currentOrder.paymentTransactionId}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* THÔNG TIN KỸ THUẬT - PAYMENT GATEWAY */}
                        {currentOrder.paymentGatewayData && Object.keys(currentOrder.paymentGatewayData).length > 0 && (
                            <section className="border-b pb-4">
                                <h3 className="font-semibold text-lg mb-3 text-indigo-700">Thông tin kỹ thuật thanh toán</h3>
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto">
                                    <pre>{JSON.stringify(currentOrder.paymentGatewayData, null, 2)}</pre>
                                </div>
                                {currentOrder.paymentGatewayData.order_url && (
                                    <div className="mt-3">
                                        <a
                                            href={currentOrder.paymentGatewayData.order_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            🔗 Mở link thanh toán ZaloPay (sandbox)
                                        </a>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* SẢN PHẨM */}
                        <section className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-3">Sản phẩm ({currentOrder.orderItems?.length})</h3>
                            <div className="space-y-3">
                                {currentOrder.orderItems?.map(item => {
                                    // Lấy danh sách ảnh từ product
                                    const productImages = item.variant?.product?.images || [];

                                    // Ưu tiên: ảnh có isThumbnail = true
                                    // Nếu không có → lấy ảnh đầu tiên (sortOrder thấp nhất)
                                    // Nếu không có ảnh nào → fallback placeholder
                                    let displayImage = "/placeholder.jpg"; // fallback

                                    const thumbnailImage = productImages.find(img => img.isThumbnail);
                                    if (thumbnailImage) {
                                        displayImage = thumbnailImage.url;
                                    } else if (productImages.length > 0) {
                                        displayImage = productImages[0].url;
                                    }

                                    return (
                                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border">
                                            {/* Ảnh sản phẩm */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={getImageUrl(displayImage)}
                                                    alt={item.variant?.product?.name || "Sản phẩm"}
                                                    className="w-20 h-20 object-cover rounded-lg border"
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder.jpg";
                                                    }}
                                                />
                                            </div>

                                            {/* Thông tin sản phẩm */}
                                            <div className="flex-1">
                                                <p className="font-medium text-lg">
                                                    {item.variant?.product?.name || "Sản phẩm không xác định"}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    SKU: <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
                                                        {item.variant?.sku || "—"}
                                                    </span>
                                                </p>
                                                <p className="text-sm mt-2">
                                                    Dung tích: <b>{item.variant?.volume || "?"}ml</b> •
                                                </p>
                                                <p className="text-sm mt-2">
                                                    Số lượng: <b className="text-blue-600">{item.quantity}</b> ×
                                                    Đơn giá: <b className="text-green-700">
                                                        {formatPrice(item.unitPrice)}₫
                                                    </b>
                                                </p>
                                            </div>

                                            {/* Tổng tiền item */}
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-green-700">
                                                    {formatPrice(currentOrder.totalAmount)}₫
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ĐỊA CHỈ GIAO HÀNG */}
                        <section>
                            <h3 className="font-semibold text-lg mb-3">Địa chỉ giao hàng</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p><b>Người nhận:</b> {currentOrder.address?.receiverName || "—"}</p>
                                <p><b>SĐT:</b> {currentOrder.address?.phone || "—"}</p>
                                {currentOrder.address?.label && <p><b>Loại địa chỉ:</b> {currentOrder.address.label}</p>}
                                <p><b>Địa chỉ:</b> {currentOrder.address?.addressLine || "—"}, {currentOrder.address?.ward?.name && `${currentOrder.address.ward.name}, `}
                                    {currentOrder.address?.ward?.province?.name || "—"}
                                </p>
                                {currentOrder.address?.zipCode && <p><b>Mã bưu điện:</b> {currentOrder.address.zipCode}</p>}
                            </div>
                        </section>

                        {/* THÔNG TIN HỆ THỐNG */}
                        <section className="text-xs text-gray-500 border-t pt-4">
                            {currentOrder.deletedAt && <p><b>Đã xóa lúc:</b> {formatDateTime(currentOrder.deletedAt)}</p>}
                        </section>
                    </div>
                </DetailModal>
            )}

            {/* MODAL XÁC NHẬN ĐƠN HÀNG – ĐƠN GIẢN */}
            {mode === "confirm" && selectedOrder && (
                <InfoModal
                    title="Xác nhận đơn hàng"
                    message={
                        <div className="text-center space-y-4 py-4">
                            <p className="text-lg">Bạn có chắc muốn <b className="text-green-600">xác nhận</b> đơn hàng này?</p>
                            <p className="text-2xl font-bold text-blue-700">#{selectedOrder.id}</p>
                            <p className="text-lg">
                                Tổng tiền: <span className="font-bold text-green-700">
                                    {Number(selectedOrder.totalAmount).toLocaleString("vi-VN")}₫
                                </span>
                            </p>
                        </div>
                    }
                    showConfirm
                    confirmText="Xác nhận ngay"
                    onConfirm={handleConfirm}
                    onClose={() => {
                        setMode(null);
                        setSelectedOrder(null);
                    }}
                />
            )}

            <div className="pt-10">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil((adminOrderList?.total || 0) / limit)}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
};

export default OrderList;