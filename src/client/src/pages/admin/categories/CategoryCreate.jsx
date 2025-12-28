import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button, InputField } from "../../../components";
import { apiCreateCategory } from "../../../api/category";
import { getAllCategoriesAdmin } from "../../../store/actions/category";
import { toast } from "react-toastify";

const CategoryCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 👉 lấy danh sách category để chọn parent
    const { adminCategoryList } = useSelector(state => state.category);

    const [form, setForm] = useState({
        name: "",
        parentId: "",
        sortOrder: 0,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // load category để chọn parent
        dispatch(getAllCategoriesAdmin({ hasPagination: false }));
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "sortOrder" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Tên danh mục là bắt buộc");
            return;
        }

        setSaving(true);
        try {
            const res = await apiCreateCategory({
                name: form.name.trim(),
                parentId: form.parentId || null,
                sortOrder: form.sortOrder || 0,
            });

            if (res?.err === 0) {
                toast.success("Tạo danh mục thành công");
                dispatch(getAllCategoriesAdmin());
                navigate(-1);
            } else {
                toast.error(res?.msg || "Tạo thất bại");
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
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-lg ring-1 ring-primary space-y-6 max-w-2xl mx-auto"
        >
            {/* Header */}
            <div className="text-center mb-10">
                <h3 className="text-xl font-bold">Tạo danh mục mới</h3>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <InputField
                    label="Tên danh mục"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                {/* Parent Category */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Danh mục cha
                    </label>
                    <select
                        name="parentId"
                        value={form.parentId}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                    >
                        <option value="">-- Không có --</option>
                        {adminCategoryList?.data
                            ?.filter(c => !c.deletedAt)
                            ?.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name || "(Chưa đặt tên)"}
                                </option>
                            ))}
                    </select>
                </div>

                <InputField
                    type="number"
                    label="Thứ tự hiển thị"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                    min={0}
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
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
                    type="submit"
                    text={saving ? "Đang tạo..." : "Thêm"}
                    width="w-20"
                    outline="rounded-md"
                    hoverBg="hover:bg-primary/80"
                    hoverText="hover:none"
                    className={saving ? "opacity-70 pointer-events-none" : ""}
                />
            </div>
        </form>
    );
};

export default CategoryCreate;
