import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    DataTable,
    CrudActions,
    InfoModal,
    DetailModal
} from "../../../components";
import { getAllRoles } from "../../../store/actions/role";
import { apiDeleteRole } from "../../../api/role";
import { toast } from "react-toastify";
import { path } from "../../../constants/path";

const RoleList = () => {
    const dispatch = useDispatch();
    const { roles, loading } = useSelector(state => state.role);

    const [selectedRole, setSelectedRole] = useState(null);
    const [mode, setMode] = useState(null);

    useEffect(() => {
        dispatch(getAllRoles());
    }, [dispatch]);

    const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Tên quyền" },
        { key: "description", label: "Mô tả" },
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
            const res = await apiDeleteRole(selectedRole.id);

            if (res?.err === 0) {
                toast.success("Xóa quyền thành công");
                dispatch(getAllRoles());
            } else {
                toast.error(res?.msg || "Xóa quyền thất bại");
            }
        } catch (error) {
            toast.error("Không thể xóa quyền");
        } finally {
            setSelectedRole(null);
            setMode(null);
        }
    };

    const actions = [
        CrudActions.view(role => {
            setSelectedRole(role);
            setMode("view");
        }),

        CrudActions.edit(
            `${path.ADMIN}/${path.ROLE_MANAGER}/${path.UPDATE}`
        ),

        CrudActions.softDelete(role => {
            if (role.name === "admin") {
                toast.warning("Không thể xóa quyền admin");
                return;
            }
            setSelectedRole(role);
            setMode("delete");
        })
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={roles || []}
                actions={actions}
                loading={loading}
            />

            {selectedRole && mode === "view" && (
                <DetailModal
                    open={true}
                    title="Chi tiết quyền"
                    onClose={() => {
                        setSelectedRole(null);
                        setMode(null);
                    }}
                >
                    <div className="space-y-2 text-sm">
                        <div><b>ID:</b> {selectedRole.id}</div>
                        <div><b>Tên quyền:</b> {selectedRole.name}</div>
                        <div>
                            <b>Mô tả:</b>{" "}
                            {selectedRole.description || "Không có"}
                        </div>
                        <div>
                            <b>Trạng thái:</b>{" "}
                            {selectedRole.deletedAt ? "Đã xóa" : "Hoạt động"}
                        </div>
                        <div>
                            <b>Ngày tạo:</b>{" "}
                            {new Date(selectedRole.createdAt).toLocaleString()}
                        </div>
                        <div>
                            <b>Ngày cập nhật:</b>{" "}
                            {new Date(selectedRole.updatedAt).toLocaleString()}
                        </div>
                        <div>
                            <b>Thời gian xóa:</b>{" "}
                            {selectedRole.deletedAt ? new Date(selectedRole.deletedAt).toLocaleString() : null}
                        </div>
                    </div>
                </DetailModal>
            )}

            {selectedRole && mode === "delete" && (
                <InfoModal
                    icon={<span className="text-red-500 text-4xl">⚠️</span>}
                    message={`Bạn có chắc muốn xóa quyền "${selectedRole.name}"?`}
                    showConfirm
                    onConfirm={handleDelete}
                    onClose={() => {
                        setSelectedRole(null);
                        setMode(null);
                    }}
                />
            )}
        </>
    );
};

export default RoleList;
