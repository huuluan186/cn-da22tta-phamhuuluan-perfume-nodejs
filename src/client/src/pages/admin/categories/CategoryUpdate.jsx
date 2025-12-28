import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button, InputField } from "../../../components";
import { apiUpdateCategory, apiGetCategoryDetail } from "../../../api/category";
import { getAllCategoriesAdmin } from "../../../store/actions/category";
import { toast } from "react-toastify";
import { toSlug } from "../../../utils";

const CategoryUpdate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const { adminCategoryList } = useSelector(state => state.category);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        parentId: "",
        sortOrder: 0,
    });

    const [isSlugEdited, setIsSlugEdited] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // load detail + category list
    useEffect(() => {
        dispatch(getAllCategoriesAdmin({ hasPagination: false }));

        const fetchDetail = async () => {
            try {
                const res = await apiGetCategoryDetail(id);
                if (res?.data?.err === 0) {
                    const c = res.data.category;
                    setForm({
                        name: c.name || "",
                        slug: c.slug || "",
                        parentId: c.parentId || "",
                        sortOrder: c.sortOrder || 0,
                    });
                } else {
                    toast.error("Không tìm thấy danh mục");
                    navigate(-1);
                }
            } catch {
                toast.error("Không thể tải dữ liệu");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, dispatch, navigate]);

    // change chung
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => {
            const newForm = {
                ...prev,
                [name]: name === "sortOrder" ? Number(value) : value,
            };

            if (name === "name" && !isSlugEdited) {
                newForm.slug = toSlug(value);
            }

            return newForm;
        });
    };

    // sửa slug tay
    const handleSlugChange = (e) => {
        setIsSlugEdited(true);
        setForm(prev => ({
            ...prev,
            slug: toSlug(e.target.value),
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
            const res = await apiUpdateCategory(id, {
                name: form.name.trim(),
                slug: form.slug.trim(),
                parentId: form.parentId || null,
                sortOrder: form.sortOrder || 0,
            });

            if (res?.err === 0) {
                toast.success("Cập nhật danh mục thành công");
                dispatch(getAllCategoriesAdmin());
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

    if (loading) {
        return (
            <div className="bg-white p-6 rounded shadow animate-pulse">
                Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-lg ring-1 ring-primary space-y-6 max-w-2xl mx-auto"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold">Cập nhật danh mục</h3>
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

                <InputField
                    label="Slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleSlugChange}
                    required
                />

                {/* Parent category */}
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
                            ?.filter(c => !c.deletedAt && c.id !== id)
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
            <div className="flex justify-center gap-4 pt-4">
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
                    text={saving ? "Đang lưu..." : "Lưu"}
                    width="w-20"
                    outline="rounded-md"
                    hoverBg="hover:bg-primary/80"
                    disabled={saving}
                />
            </div>
        </form>
    );
};

export default CategoryUpdate;
