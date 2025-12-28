import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataTable, CrudActions, DetailModal, InfoModal, Pagination, ProductDetailModal } from "../../../components";
import { getProductsAdmin } from "../../../store/actions/product";
import { apiDeleteProduct } from "../../../api/product";
import { toast } from "react-toastify";
import { ADMIN_PER_PAGE } from "../../../constants/pagination";
import { path } from "../../../constants/path";

const AdminProductList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { adminProductList, adminLoading } = useSelector(state => state.product);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [mode, setMode] = useState(null);
    const [page, setPage] = useState(1);

    const limit = ADMIN_PER_PAGE;

    useEffect(() => {
        dispatch(getProductsAdmin({ page, limit, hasPagination: true }));
    }, [dispatch, page, limit]);

    const columns = [
        {
            key: "id",
            label: "ID",
            render: r => <span title={r.id}>#{r.id?.slice(0, 8).toUpperCase()}</span>
        },
        { key: "name", label: "Tên sản phẩm" },
        {
            key: "brand",
            label: "Thương hiệu",
            render: r => r.brand?.name || "—"
        },
        {
            key: "gender",
            label: "Giới tính",
            render: r => (
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    {r.gender || "—"}
                </span>
            )
        },
        {
            key: "stock",
            label: "Số lượng kho",
            render: r => {
                const activeVariants = r.variants?.filter(v => !v.deletedAt) || [];
                const totalStock = activeVariants.reduce((sum, v) => sum + (+v.stockQuantity || 0), 0);

                let className = "text-gray-700";
                if (totalStock === 0) className = "text-red-600 font-bold";
                else if (totalStock < 10) className = "text-red-500 font-bold";
                else if (totalStock < 50) className = "text-yellow-600 font-bold";
                else className = "text-green-600 font-semibold";

                return (
                    <span className={className}>
                        {totalStock}
                    </span>
                );
            }
        },
        {
            key: "variants",
            label: "Dung tích",
            render: r => {
                // LỌC CHỈ VARIANT CHƯA BỊ XÓA (deletedAt === null)
                const activeVariants = r.variants?.filter(v => !v.deletedAt) || [];

                if (activeVariants.length === 0) {
                    return (
                        <span className="text-red-500 text-sm">
                            Chưa có
                        </span>
                    );
                }

                // Lấy volume unique + sort tăng dần
                const volumes = [...new Set(activeVariants.map(v => v.volume))]
                    .sort((a, b) => a - b);

                return (
                    <span
                        className="text-blue-600 cursor-pointer hover:underline text-sm"
                        onClick={() => navigate(path.UPDATE.replace(':id', r.id))} // chuyển về trang update chung
                    >
                        {activeVariants.length} ({volumes.map(v => `${v}ml`).join(", ")})
                    </span>
                );
            }
        },
        {
            key: "status",
            label: "Trạng thái",
            render: r =>
                r.deletedAt
                    ? <span className="text-red-500">Ngừng bán</span>
                    : <span className="text-green-600">Đang bán</span>
        }
    ];

    const handleDelete = async () => {
        try {
            const res = await apiDeleteProduct(selectedProduct.id);
            if (res?.err === 0) {
                toast.success("Xóa sản phẩm thành công");
                dispatch(getProductsAdmin({ page, limit, hasPagination: true }));
            } else {
                toast.error(res?.msg || "Xóa thất bại");
            }
        } finally {
            setSelectedProduct(null);
            setMode(null);
        }
    };

    const actions = [
        CrudActions.view(p => {
            setSelectedProduct(p);
            setMode("view");
        }),
        CrudActions.edit(path.UPDATE),
        CrudActions.softDelete(p => {
            setSelectedProduct(p);
            setMode("delete");
        })
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={adminProductList?.data || []}
                actions={actions}
                loading={adminLoading}
            />

            {mode === "view" && selectedProduct && (
                <DetailModal
                    open
                    title="Chi tiết sản phẩm"
                    onClose={() => setSelectedProduct(null)}
                >
                    <ProductDetailModal product={selectedProduct} />
                </DetailModal>
            )}

            {mode === "delete" && selectedProduct && (
                <InfoModal
                    message={`Xóa sản phẩm "${selectedProduct.name}"?`}
                    showConfirm
                    onConfirm={handleDelete}
                    onClose={() => {
                        setSelectedProduct(null);
                        setMode(null);
                    }}
                />
            )}

            <div className="pt-8">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil((adminProductList?.total || 0) / limit)}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
};

export default AdminProductList;
