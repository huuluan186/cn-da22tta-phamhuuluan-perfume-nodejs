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
    getAllContactsAdmin,
    getContactDetailAdmin,
} from "../../../store/actions/contact";
import {
    apiDeleteContact,
    apiUpdateContactStatus,
} from "../../../api/contact";
import { toast } from "react-toastify";
import { ADMIN_PER_PAGE } from "../../../constants/pagination";
import { formatDateTime } from "../../../utils";
import icons from '../../../assets/react-icons/icon'

const { FaRegEdit } = icons

const ContactList = () => {
    const dispatch = useDispatch();
    const { adminContactList, currentContact } = useSelector(state => state.contact);

    const [selectedContact, setSelectedContact] = useState(null);
    const [mode, setMode] = useState(null); // "view" | "delete" | "updateStatus"
    const [newStatus, setNewStatus] = useState("");
    const [page, setPage] = useState(1);

    const limit = ADMIN_PER_PAGE;
    const hasPagination = true;

    // Load danh sách contacts
    useEffect(() => {
        dispatch(getAllContactsAdmin({ page, limit, hasPagination }));
    }, [dispatch, page, limit]);

    // Xử lý xóa contact
    const handleDelete = async () => {
        try {
            const res = await apiDeleteContact(selectedContact.id);
            if (res?.err === 0) {
                toast.success("Xóa liên hệ thành công");
                dispatch(getAllContactsAdmin({ page, limit, hasPagination }));
            } else {
                toast.error(res?.msg || "Xóa liên hệ thất bại");
            }
        } catch {
            toast.error("Không thể xóa liên hệ");
        } finally {
            setSelectedContact(null);
            setMode(null);
        }
    };

    // Xử lý cập nhật trạng thái
    const handleUpdateStatus = async () => {
        try {
            const res = await apiUpdateContactStatus(selectedContact.id, newStatus);
            if (res?.err === 0) {
                toast.success("Cập nhật trạng thái thành công");
                dispatch(getAllContactsAdmin({ page, limit, hasPagination }));
            } else {
                toast.error(res?.msg || "Cập nhật trạng thái thất bại");
            }
        } catch {
            toast.error("Không thể cập nhật trạng thái");
        } finally {
            setSelectedContact(null);
            setMode(null);
            setNewStatus("");
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            new: { label: "Mới", color: "text-blue-600 bg-blue-100" },
            replied: { label: "Đã trả lời", color: "text-green-600 bg-green-100" },
            ignored: { label: "Đã bỏ qua", color: "text-gray-600 bg-gray-100" },
        };
        const config = statusConfig[status] || statusConfig.new;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const columns = [
        { key: "id", label: "ID", minWidth: "60px", maxWidth: "150px" },
        { key: "name", label: "Họ tên" },
        { key: "email", label: "Email" },
        {
            key: "status",
            label: "Trạng thái",
            render: (row) => getStatusBadge(row.status),
        },
        {
            key: "createdAt",
            label: "Ngày gửi",
            render: (row) => formatDateTime(row.createdAt),
        },
    ];

    const actions = [
        // Xem chi tiết
        CrudActions.view((row) => {
            dispatch(getContactDetailAdmin(row.id));
            setMode("view");
        }),

        // Cập nhật trạng thái
        {
            Component: ({ row }) => {
                const isDeleted = !!row.deletedAt;

                return (
                    <Button
                        text={<FaRegEdit />}
                        textSize="text-lg"
                        width="w-10"
                        height="h-8"
                        outline="rounded-md"
                        bgColor={isDeleted ? "bg-gray-300" : "bg-orange-500"}
                        hoverBg={isDeleted ? "" : "hover:bg-orange-600"}
                        onClick={() => {
                            if (!isDeleted) {
                                setSelectedContact(row);
                                setNewStatus(row.status);
                                setMode("updateStatus");
                            }
                        }}
                        className={isDeleted ? "cursor-not-allowed opacity-60" : ""}
                        title={isDeleted ? "Liên hệ đã bị xóa, không thể cập nhật" : "Cập nhật trạng thái"}
                    />
                );
            },
        },

        // Xóa
        CrudActions.softDelete((row) => {
            setSelectedContact(row);
            setMode("delete");
        }),
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={adminContactList?.data || []}
                actions={actions}
                loading={!adminContactList}
            />

            {/* CHI TIẾT CONTACT */}
            {mode === "view" && currentContact && (
                <DetailModal
                    open
                    title={`Liên hệ #${currentContact.id}`}
                    onClose={() => setMode(null)}
                >
                    <div className="space-y-4 text-sm">
                        <section className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-3">Thông tin liên hệ</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><b>ID:</b> {currentContact.id}</div>
                                <div><b>Trạng thái:</b> {getStatusBadge(currentContact.status)}</div>
                                <div><b>Họ tên:</b> {currentContact.name}</div>
                                <div><b>Email:</b> {currentContact.email}</div>
                                <div className="col-span-2"><b>Nội dung:</b></div>
                                <div className="col-span-2 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                                    {currentContact.message}
                                </div>
                                <div><b>Ngày gửi:</b> {formatDateTime(currentContact.createdAt)}</div>
                                <div><b>Cập nhật:</b> {formatDateTime(currentContact.updatedAt)}</div>
                                {currentContact.deletedAt && (
                                    <div className="col-span-2 text-red-600">
                                        <b>Đã xóa lúc:</b> {formatDateTime(currentContact.deletedAt)}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </DetailModal>
            )}

            {/* CONFIRM XÓA */}
            {mode === "delete" && selectedContact && (
                <InfoModal
                    icon={<span className="text-red-500 text-4xl">⚠️</span>}
                    message={`Bạn có chắc muốn xóa liên hệ từ "${selectedContact.name}" (${selectedContact.email})?`}
                    showConfirm
                    onConfirm={handleDelete}
                    onClose={() => {
                        setSelectedContact(null);
                        setMode(null);
                    }}
                />
            )}

            {/* CẬP NHẬT TRẠNG THÁI */}
            {mode === "updateStatus" && selectedContact && (
                <DetailModal
                    open
                    title="Cập nhật trạng thái"
                    onClose={() => {
                        setSelectedContact(null);
                        setMode(null);
                        setNewStatus("");
                    }}
                >
                    <div className="space-y-4">
                        <div>
                            <p className="mb-2"><b>Liên hệ từ:</b> {selectedContact.name}</p>
                            <p className="mb-4 text-sm text-gray-600">{selectedContact.email}</p>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Trạng thái mới:</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="new">Mới</option>
                                <option value="replied">Đã trả lời</option>
                                <option value="ignored">Đã bỏ qua</option>
                            </select>
                        </div>

                        <div className="flex gap-2 justify-end pt-4">
                            <Button
                                text="Hủy"
                                bgColor="bg-gray-300"
                                hoverBg="hover:bg-gray-400"
                                onClick={() => {
                                    setSelectedContact(null);
                                    setMode(null);
                                    setNewStatus("");
                                }}
                            />
                            <Button
                                text="Cập nhật"
                                bgColor="bg-blue-500"
                                hoverBg="hover:bg-blue-600"
                                onClick={handleUpdateStatus}
                            />
                        </div>
                    </div>
                </DetailModal>
            )}

            {/* PHÂN TRANG */}
            <div className="pt-10">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil((adminContactList?.total || 0) / limit)}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
};

export default ContactList;
