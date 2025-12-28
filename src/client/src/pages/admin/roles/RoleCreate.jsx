import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button, InputField } from "../../../components/index";
import { apiCreateRole } from "../../../api/role";
import { getAllRoles } from "../../../store/actions/role";
import { toast } from "react-toastify";

const RoleCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { roles } = useSelector((state) => state.role);

    const [form, setForm] = useState({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Tự động fetch roles nếu chưa có (để tránh trường hợp reload trang)
    useEffect(() => {
        if (!roles || roles.length === 0) {
            dispatch(getAllRoles());
        }
    }, [roles, dispatch]);

    // Skeleton nhẹ khi đang fetch (giữ trải nghiệm mượt)
    if (!roles || roles.length === 0) {
        return (
            <div className="bg-white p-4 rounded shadow space-y-6">
                <h3 className="text-lg font-semibold text-gray-400">
                    Đang tải dữ liệu...
                </h3>
                <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                    <div className="h-32 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async () => {
        const newErrors = {};
        if (!form.name.trim()) {
            newErrors.name = "Tên quyền không được để trống";
        }
        // Kiểm tra trùng tên quyền (tránh tạo role giống hệt)
        if (roles.some((role) => role.name.toLowerCase() === form.name.trim().toLowerCase())) {
            newErrors.name = "Tên quyền đã tồn tại";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSaving(true);
        try {
            const res = await apiCreateRole({
                name: form.name.trim(),
                description: form.description.trim() || null,
            });

            if (res?.err === 0) {
                toast.success("Tạo quyền mới thành công");
                dispatch(getAllRoles()); // Refresh danh sách
                navigate(-1); // Quay về trang danh sách
            } else {
                toast.error(res?.msg || "Tạo quyền thất bại");
            }
        } catch (error) {
            const msg =
                error?.response?.data?.msg ||
                "Có lỗi khi tạo";

            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg ring-1 ring-primary space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <h3 className="text-xl font-bold text-gray-800">
                    Tạo quyền mới
                </h3>
                <p className="text-lg text-gray-600 mt-2">
                    Thêm một vai trò mới vào hệ thống
                </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <InputField
                    label="Tên quyền"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ví dụ: admin, moderator, staff, vip..."
                    required
                    error={errors.name}
                    setError={setErrors}
                />

                <InputField
                    label="Mô tả (tùy chọn)"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn gọn về vai trò của quyền này"
                    setError={setErrors}
                />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4">
                <Button
                    text="Hủy"
                    width="w-20"
                    outline="rounded-md"
                    bgColor="bg-gray-300"
                    textColor="text-black"
                    hoverBg="hover:bg-gray-400"
                    onClick={() => navigate(-1)}
                />

                <Button
                    text={saving ? "Đang tạo..." : "Thêm"}
                    width="w-20"
                    outline="rounded-md"
                    hoverBg="hover:bg-primary/80"
                    hoverText="hover:none"
                    onClick={handleSubmit}
                    disabled={saving}
                    className={saving ? "opacity-70 pointer-events-none" : ""}
                />
            </div>
        </div>
    );
};

export default RoleCreate;