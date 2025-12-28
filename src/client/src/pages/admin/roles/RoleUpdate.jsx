import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button, InputField } from "../../../components/index";
import { apiUpdateRole } from "../../../api/role";
import { getAllRoles } from "../../../store/actions/role";
import { toast } from "react-toastify";

const RoleUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { roles } = useSelector((state) => state.role);

    // Tự động fetch roles nếu store chưa có dữ liệu
    useEffect(() => {
        if (!roles || roles.length === 0) {
            dispatch(getAllRoles());
        }
    }, [roles, dispatch]);

    const currentRole = roles?.find((role) => role.id === id);

    const [form, setForm] = useState({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Điền form khi có currentRole
    useEffect(() => {
        if (currentRole) {
            setForm({
                name: currentRole.name || "",
                description: currentRole.description || "",
            });
        }
    }, [currentRole]);

    // Nếu đã có dữ liệu roles mà không tìm thấy role → báo lỗi
    useEffect(() => {
        if (roles && roles.length > 0 && !currentRole) {
            toast.error("Không tìm thấy quyền này");
            navigate(-1);
        }
    }, [roles, currentRole, navigate]);

    // Nếu chưa có roles → hiện placeholder nhẹ (không full loading screen)
    if (!roles || roles.length === 0) {
        return (
            <div className="bg-white p-4 rounded shadow space-y-6">
                <h3 className="text-lg font-semibold text-gray-400">
                    Đang tải thông tin quyền...
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
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async () => {
        const newErrors = {};
        if (!form.name.trim()) {
            newErrors.name = "Tên quyền không được để trống";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSaving(true);
        try {
            const res = await apiUpdateRole(id, {
                name: form.name.trim(),
                description: form.description.trim() || null,
            });

            if (res?.err === 0) {
                toast.success("Cập nhật quyền thành công");
                dispatch(getAllRoles()); // Refresh để cập nhật ngay
                navigate(-1);
            } else {
                toast.error(res?.msg || "Cập nhật thất bại");
            }
        } catch (error) {
            const msg =
                error?.response?.data?.msg ||
                "Có lỗi khi cập nhật";

            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg ring-1 ring-primary space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                    <h3 className="text-xl font-bold text-gray-800">
                        Cập nhật quyền
                    </h3>
                    <p className="text-lg text-gray-600 mt-2">
                        ID: <span className="font-mono font-semibold text-primary">{id}</span>
                        {currentRole && (
                            <span className="ml-3 text-gray-500">
                                (Hiện tại: <span className="font-medium text-primary">{currentRole.name}</span>)
                            </span>
                        )}
                    </p>
                </div>

            <div className="space-y-4">
                <InputField
                    label="Tên quyền"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ví dụ: admin, moderator..."
                    required
                    error={errors.name}
                    setError={setErrors}
                />

                <InputField
                    label="Mô tả"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả về quyền này (tùy chọn)"
                />
            </div>

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
                    text={saving ? "Đang lưu..." : "Lưu"}
                    width="w-20"
                    outline="rounded-md"
                    hoverBg="hover:bg-primary/80"
                    onClick={handleSubmit}
                    disabled={saving}
                    className={saving ? "opacity-70 pointer-events-none" : ""}
                />
            </div>
        </div>
    );
};

export default RoleUpdate;