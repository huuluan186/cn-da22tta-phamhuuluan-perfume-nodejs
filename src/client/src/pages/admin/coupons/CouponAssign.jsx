// src/pages/admin/coupon/CouponAssign.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components";
import { getAllUsers } from "../../../store/actions/user";
import { apiAssignCouponManual } from "../../../api/coupon";
import { toast } from "react-toastify";
import { formatPrice } from "../../../utils";

const CouponAssign = () => {
    const { id: couponId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy danh sách coupon và user từ Redux
    const { adminCouponList } = useSelector(state => state.coupon);
    const { users, loading: loadingUsers } = useSelector(state => state.user);

    // Tìm coupon theo id trong danh sách đã load
    const couponInfo =
        adminCouponList?.data?.find(c => String(c.id) === couponId) || null;


    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [validFrom, setValidFrom] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [assigning, setAssigning] = useState(false);

    // Load user khi vào trang
    useEffect(() => {
        dispatch(getAllUsers({}));
    }, [dispatch]);

    // Nếu không tìm thấy coupon → quay về
    useEffect(() => {
        if (!adminCouponList?.data) return;

        if (!couponInfo) {
            toast.error("Không tìm thấy coupon này");
            navigate(-1);
        }
    }, [adminCouponList, couponInfo, navigate]);

    // Sắp xếp user theo email A → Z
    const sortedUsers = users?.data
        ? [...users.data].sort((a, b) =>
            a.email.toLowerCase().localeCompare(b.email.toLowerCase())
        )
        : [];

    const handleToggleUser = (userId) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAssign = async () => {
        if (selectedUserIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 người dùng");
            return;
        }

        const payload = {
            userIds: selectedUserIds,
            validFrom: validFrom || null,
            validUntil: validUntil || null
        };

        setAssigning(true);
        try {
            const res = await apiAssignCouponManual(couponId, payload);

            if (res.err === 0) {
                toast.success(
                    `Gán thành công cho ${res.assigned} người dùng!` +
                    (res.skipped > 0 ? ` (Bỏ qua ${res.skipped} người đã có)` : "")
                );
                navigate(-1);
            } else {
                toast.error(res.msg || "Gán coupon thất bại");
            }
        } catch (error) {
            console.log("Assign coupon error:", error);
            toast.error(error?.msg || "Có lỗi xảy ra");
        } finally {
            setAssigning(false);
        }
    };

    if (!couponInfo) {
        return <div className="text-center py-10">Đang tải thông tin coupon...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold">Gán coupon cho người dùng</h2>
                <p className="text-3xl font-mono font-bold text-primary mt-3">
                    {couponInfo.code}
                </p>
            </div>

            {/* Thông tin coupon */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-blue-50 py-3 px-4 rounded">
                    <p className="text-gray-600">Mã</p>
                    <p className="text-xl font-bold text-primary mt-1">{couponInfo.code}</p>
                </div>
                <div className="bg-green-50 py-3 px-4 rounded">
                    <p className="text-gray-600">Loại</p>
                    <p className="text-lg font-bold mt-1">
                        {couponInfo.discountType === "fixed" ? "Giảm tiền" : "Giảm %"}
                    </p>
                </div>
                <div className="bg-yellow-50 py-3 px-4 rounded">
                    <p className="text-gray-600">Giá trị</p>
                    <p className="text-xl font-bold text-green-700 mt-1">
                        {couponInfo.discountType === "fixed"
                            ? `${formatPrice(couponInfo.discountValue)}₫`
                            : `${couponInfo.discountValue}%`
                        }
                    </p>
                </div>
            </div>

            {/* Danh sách user */}
            <div>
                <p className="text-base font-medium mb-2">
                    Chọn người dùng ({selectedUserIds.length} người)
                </p>

                {loadingUsers ? (
                    <p className="text-center py-4 text-gray-500 text-sm">Đang tải...</p>
                ) : sortedUsers.length === 0 ? (
                    <p className="text-center py-4 text-gray-500 text-sm">Chưa có người dùng nào</p>
                ) : (
                    <div className="max-h-64 overflow-y-auto border border-gray-300 rounded">
                        {sortedUsers.map(user => (
                            <label
                                key={user.id}
                                className="flex items-center gap-3 px-3 py-2 border-b hover:bg-gray-50 cursor-pointer text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedUserIds.includes(user.id)}
                                    onChange={() => handleToggleUser(user.id)}
                                    className="h-4 w-4 text-primary rounded"
                                />
                                <div>
                                    <p className="font-medium">{user.email}</p>
                                    {user.name && <p className="text-xs text-gray-500">{user.name}</p>}
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Ngày hiệu lực */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <label className="block font-medium mb-1">Hiệu lực từ (tùy chọn)</label>
                    <input
                        type="datetime-local"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={validFrom}
                        onChange={(e) => setValidFrom(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Hiệu lực đến (tùy chọn)</label>
                    <input
                        type="datetime-local"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                    />
                </div>
            </div>

            {/* Nút */}
            <div className="flex justify-center gap-4 pt-4">
                <Button
                    text="Hủy"
                    bgColor="bg-gray-300"
                    hoverBg="hover:bg-gray-400"
                    textColor="text-black"
                    width="w-28"
                    onClick={() => navigate(-1)}
                />
                <Button
                    text={assigning ? "Đang gán..." : `Gán cho ${selectedUserIds.length} người`}
                    disabled={assigning || selectedUserIds.length === 0}
                    width="w-48"
                    hoverBg="hover:bg-primary/80"
                    hoverText="hover:none"
                    onClick={handleAssign}
                />
            </div>
        </div>
    );
};

export default CouponAssign;