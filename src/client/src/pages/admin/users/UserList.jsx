import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable, CrudActions, DetailModal, InfoModal, Pagination } from "../../../components";
import { getAllUsers } from "../../../store/actions/user";
import { toast } from "react-toastify";
import { apiDeleteUser } from "../../../api/user";
import { ADMIN_PER_PAGE } from '../../../constants/pagination'
import { path } from "../../../constants/path";
import { formatDateTime } from "../../../utils";

const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.user);
    const [selectedUser, setSelectedUser] = useState(null);
    const [mode, setMode] = useState(null);
    const [page, setPage] = useState(1)
    const limit = ADMIN_PER_PAGE
    const hasPagination = true;

    useEffect(() => {
        dispatch(getAllUsers({ page, limit, hasPagination }));
    }, [dispatch, page, limit, hasPagination]);

    const columns = [
        { key: "id", label: "ID" },
        { key: "email", label: "Email" },
        {
            key: "roles",
            label: "Vai trò",
            render: row =>
                row.roles?.map(r => r.name).join(", ") || "Chưa có"
        },
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
            const res = await apiDeleteUser(selectedUser.id);

            if (res?.err === 0) {
                toast.success("Xóa người dùng thành công");
                dispatch(getAllUsers({ page, limit, hasPagination }));
            } else {
                toast.error(res?.msg || "Xóa thất bại");
            }
        } catch (error) {
            toast.error("Không thể xóa người dùng");
        } finally {
            setSelectedUser(null);
            setMode(null);
        }
    };

    const actions = [
        CrudActions.view(user => {
            setSelectedUser(user);
            setMode('view');
        }),

        CrudActions.editRole(path.UPDATE),

        CrudActions.softDelete(user => {
            if (user.roles?.some(r => r.name === 'admin')) {
                toast.warning("Không thể xóa admin");
                return;
            }
            setSelectedUser(user);
            setMode('delete');
        })
    ];


    return (
        <>
            <div>
                <DataTable columns={columns} data={users?.data || []} actions={actions} loading={loading}/>
    
                {/* VIEW DETAIL */}
                {selectedUser && mode === 'view' && (
                    <DetailModal
                        open={true}
                        title="Chi tiết người dùng"
                        onClose={() => setSelectedUser(null)}
                    >
                        <div className="space-y-2 text-sm">
                            <div><b>ID:</b> {selectedUser.id}</div>
                            <div><b>Họ:</b> {selectedUser.firstname}</div>
                            <div><b>Tên:</b> {selectedUser.lastname}</div>
                            <div><b>Email:</b> {selectedUser.email}</div>
                            <div>
                                <b>Ngày sinh:</b>{" "}
                                {selectedUser.dateOfBirth
                                    ? formatDateTime(selectedUser.dateOfBirth)
                                    : "Chưa cập nhật"}
                            </div>
                            <div>
                                <b>Giới tính:</b>{" "}
                                {selectedUser.gender || "Chưa cập nhật"}
                            </div>
                            <div>
                                <b>Vai trò:</b>{" "}
                                {selectedUser.roles?.map(r => r.name).join(", ")}
                            </div>
                            <div>
                                <b>Trạng thái:</b>{" "}
                                {selectedUser.deletedAt ? "Đã xóa" : "Hoạt động"}
                            </div>
                            <div>
                                <b>Thời gian tạo:</b>{" "}
                                {formatDateTime(selectedUser.createdAt)}
                            </div>
                            <div>
                                <b>Thời gian cập nhật:</b>{" "}
                                {formatDateTime(selectedUser.updatedAt)}
                            </div>
                            <div>
                                <b>Thời gian xóa:</b>{" "}
                                {selectedUser.deletedAt ? formatDateTime(selectedUser.deletedAt) : null}
                            </div>
                        </div>
                    </DetailModal>
                )}
                {/* CONFIRM DELETE */}
                {selectedUser && mode === 'delete' && (
                    <InfoModal
                        icon={<span className="text-red-500 text-4xl">⚠️</span>}
                        message={`Bạn có chắc muốn xóa user ${selectedUser.email}?`}
                        showConfirm
                        onConfirm={handleDelete}
                        onClose={() => {
                            setSelectedUser(null);
                            setMode(null);
                        }}
                    />
                )}
            </div>
            <div className="pt-10">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil((users?.total || users?.data?.length || 0)/limit) }
                    onPageChange={setPage}
                />
            </div>
        </>
    );
};

export default UserList;
