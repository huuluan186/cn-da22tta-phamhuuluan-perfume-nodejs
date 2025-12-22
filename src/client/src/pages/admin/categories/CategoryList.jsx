import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    DataTable,
    CrudActions,
    DetailModal,
    InfoModal,
    Pagination
} from "../../../components";
import { getAllCategoriesAdmin } from "../../../store/actions/category";
import { toast } from "react-toastify";
import { apiDeleteCategory } from "../../../api/category";
import { ADMIN_PER_PAGE } from "../../../constants/pagination";
import { path } from "../../../constants/path";
import { formatDateTime } from "../../../utils";

const CategoryList = () => {
    const dispatch = useDispatch();
    const { adminCategoryList, loading } = useSelector(state => state.category);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [mode, setMode] = useState(null);
    const [page, setPage] = useState(1);

    const limit = ADMIN_PER_PAGE;
    const hasPagination = true;

    useEffect(() => {
        dispatch(getAllCategoriesAdmin({ page, limit, hasPagination }));
    }, [dispatch, page, limit, hasPagination]);

    const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Tên danh mục" },
        { key: "slug", label: "Slug" },
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
            const res = await apiDeleteCategory(selectedCategory.id);
            if (res?.err === 0) {
                toast.success("Xóa danh mục thành công");
                dispatch(getAllCategoriesAdmin({ page, limit, hasPagination }));
            } else {
                toast.error(res?.msg || "Xóa thất bại");
            }
        } catch {
            toast.error("Không thể xóa danh mục");
        } finally {
            setSelectedCategory(null);
            setMode(null);
        }
    };

    const actions = [
        CrudActions.view(category => {
            setSelectedCategory(category);
            setMode("view");
        }),

        CrudActions.edit(path.UPDATE),

        CrudActions.softDelete(category => {
            setSelectedCategory(category);
            setMode("delete");
        })
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={adminCategoryList?.data || []}
                actions={actions}
                loading={loading}
            />

            {/* VIEW DETAIL */}
            {selectedCategory && mode === "view" && (
                <DetailModal
                    open={true}
                    title="Chi tiết danh mục"
                    onClose={() => setSelectedCategory(null)}
                >
                    <div className="space-y-2 text-sm">
                        <div><b>ID:</b> {selectedCategory.id}</div>
                        <div><b>Tên:</b> {selectedCategory.name}</div>
                        <div><b>Slug:</b> {selectedCategory.slug}</div>
                        <div><b>Parent ID:</b> {selectedCategory.parentId || "—"}</div>
                        <div><b>Thứ tự:</b> {selectedCategory.sortOrder}</div>
                        <div>
                            <b>Trạng thái:</b>{" "}
                            {selectedCategory.deletedAt ? "Đã xóa" : "Hoạt động"}
                        </div>
                        <div>
                            <b>Ngày tạo:</b>{" "}
                            {formatDateTime(selectedCategory.createdAt)}
                        </div>
                        <div>
                            <b>Cập nhật:</b>{" "}
                            {formatDateTime(selectedCategory.updatedAt)}
                        </div>
                        <div>
                            <b>Ngày xóa:</b>{" "}
                            {
                                selectedCategory.deletedAt ? 
                                    formatDateTime(selectedCategory.deletedAt) 
                                    : null
                            }
                        </div>
                    </div>
                </DetailModal>
            )}

            {/* CONFIRM DELETE */}
            {selectedCategory && mode === "delete" && (
                <InfoModal
                    icon={<span className="text-red-500 text-4xl">⚠️</span>}
                    message={`Bạn có chắc muốn xóa danh mục "${selectedCategory.name}"?`}
                    showConfirm
                    onConfirm={handleDelete}
                    onClose={() => {
                        setSelectedCategory(null);
                        setMode(null);
                    }}
                />
            )}

            {/* PAGINATION */}
            <div className="pt-10">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(
                        (adminCategoryList?.total || adminCategoryList?.data?.length || 0) / limit
                    )}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
};

export default CategoryList;
