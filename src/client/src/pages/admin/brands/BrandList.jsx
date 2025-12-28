import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    DataTable,
    CrudActions,
    DetailModal,
    InfoModal,
    Pagination
} from "../../../components";
import { getAllBrandsAdmin } from "../../../store/actions/brand";
import { toast } from "react-toastify";
import { apiDeleteBrand } from "../../../api/brand";
import { ADMIN_PER_PAGE } from "../../../constants/pagination";
import { path } from "../../../constants/path";
import { formatDateTime } from "../../../utils";

const BrandList = () => {
    const dispatch = useDispatch();
    const { adminBrandList, loading } = useSelector(state => state.brand);

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [mode, setMode] = useState(null);
    const [page, setPage] = useState(1);

    const limit = ADMIN_PER_PAGE;
    const hasPagination = true;

    useEffect(() => {
        dispatch(getAllBrandsAdmin({ page, limit, hasPagination, }));
    }, [dispatch, page, limit, hasPagination]);

    const columns = [
        { key: "id", label: "ID", minWidth: "60px", maxWidth: "150px" },
        {
            key: "logoUrl",
            label: "Logo",
            width: "120px",
            minWidth: "120px",
            render: row => (
                <img
                    src={row.logoUrl}
                    alt={row.name}
                    className="w-16 h-10 object-contain mx-auto"
                />
            )
        },
        { key: "name", label: "Tên thương hiệu" },
        { key: "country", label: "Quốc gia" },
        {
            key: "status",
            label: "Trạng thái",
            render: row =>
                row.deletedAt ? (
                    <span className="text-red-500 font-medium">Đã xóa</span>
                ) : (
                    <span className="text-green-600 font-medium">Hoạt động</span>
                )
        }
    ];

    const handleDelete = async () => {
        try {
            const res = await apiDeleteBrand(selectedBrand.id);

            if (res?.err === 0) {
                toast.success("Xóa thương hiệu thành công");
                dispatch(getAllBrandsAdmin({ page, limit, hasPagination }));
            } else {
                toast.error(res?.msg || "Xóa thất bại");
            }
        } catch (error) {
            toast.error("Không thể xóa thương hiệu");
        } finally {
            setSelectedBrand(null);
            setMode(null);
        }
    };

    const actions = [
        CrudActions.view(brand => {
            setSelectedBrand(brand);
            setMode("view");
        }),

        CrudActions.edit(path.UPDATE),

        CrudActions.softDelete(brand => {
            setSelectedBrand(brand);
            setMode("delete");
        })
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={adminBrandList?.data || []}
                actions={actions}
                loading={loading}
            />

            {/* VIEW DETAIL */}
            {selectedBrand && mode === "view" && (
                <DetailModal
                    open={true}
                    title="Chi tiết thương hiệu"
                    onClose={() => setSelectedBrand(null)}
                >
                    <div className="space-y-2 text-sm">
                        <div><b>ID:</b> {selectedBrand.id}</div>
                        <div><b>Tên:</b> {selectedBrand.name}</div>
                        <div><b>Quốc gia:</b> {selectedBrand.country || "—"}</div>
                        <div>
                            <b>Logo:</b>
                            <img
                                src={selectedBrand.logoUrl}
                                alt={selectedBrand.name}
                                className="w-32 mt-2"
                            />
                        </div>
                        <div><b>Mô tả:</b> {selectedBrand.description || "—"}</div>
                        <div>
                            <b>Trạng thái:</b>{" "}
                            {selectedBrand.deletedAt ? "Đã xóa" : "Hoạt động"}
                        </div>
                        <div>
                            <b>Ngày tạo:</b>{" "}
                            {formatDateTime(selectedBrand.createdAt)}
                        </div>
                        <div>
                            <b>Ngày cập nhật:</b>{" "}
                            {formatDateTime(selectedBrand.updatedAt)}
                        </div>
                        <div>
                            <b>Ngày xóa:</b>{" "}
                            {selectedBrand.deletedAt ? formatDateTime(selectedBrand.deletedAt) : null}
                        </div>
                    </div>
                </DetailModal>
            )}

            {/* CONFIRM DELETE */}
            {selectedBrand && mode === "delete" && (
                <InfoModal
                    icon={<span className="text-red-500 text-4xl">⚠️</span>}
                    message={`Bạn có chắc muốn xóa thương hiệu "${selectedBrand.name}"?`}
                    showConfirm
                    onConfirm={handleDelete}
                    onClose={() => {
                        setSelectedBrand(null);
                        setMode(null);
                    }}
                />
            )}

            {/* PAGINATION */}
            <div className="pt-10">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(
                        (adminBrandList?.total || adminBrandList?.data?.length || 0) / limit
                    )}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
};

export default BrandList;
