import { useState } from "react";
import { DataTable, UserActions, DetailModal } from "../../../components/index";

const UserList = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    const users = [
        { id: 1, email: "admin@gmail.com", role: "admin", isDelete: null },
        { id: 2, email: "user@gmail.com", role: "user", isDelete: null },
    ];

    const columns = [
        {
            key: "index",
            label: "#",
            render: (_, index) => index + 1
        },
        { key: "email", label: "Email" },
        { key: "role", label: "Vai trò" },
        {
            key: "status",
            label: "Trạng thái",
            render: row =>
                row.isDelete ? (
                    <span className="text-red-500 font-medium">Đã xóa</span>
                ) : (
                    <span className="text-green-600 font-medium">Hoạt động</span>
                )
        }
    ];

    const actions = [
        UserActions.view(user => setSelectedUser(user)),
        UserActions.editRole,
        UserActions.softDelete
    ];

    return (
        <div>
            <DataTable
                columns={columns}
                data={users}
                actions={actions}
            />

            {/* MODAL DETAIL */}
            {selectedUser && (
                <DetailModal
                    open={true}
                    title="Chi tiết người dùng"
                    onClose={() => setSelectedUser(null)}
                >
                    <div className="space-y-2 text-sm">
                        <div><b>ID:</b> {selectedUser.id}</div>
                        <div><b>Email:</b> {selectedUser.email}</div>
                        <div><b>Vai trò:</b> {selectedUser.role}</div>
                        <div>
                            <b>Trạng thái:</b>{" "}
                            {selectedUser.isDelete ? "Đã xóa" : "Hoạt động"}
                        </div>
                    </div>
                </DetailModal>
            )}
        </div>
    );
};

export default UserList;
