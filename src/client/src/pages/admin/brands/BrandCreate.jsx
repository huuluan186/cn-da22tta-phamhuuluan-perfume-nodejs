import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Button, InputField } from "../../../components";
import { apiCreateBrand } from "../../../api/brand";
import { getAllBrandsAdmin } from "../../../store/actions/brand";
import { toast } from "react-toastify";

const BrandCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        name: "",
        country: "",
        logoUrl: "",
        posterUrl: "",
        description: ""
    });

    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 🔥 quan trọng

        setSaving(true);
        try {
            const res = await apiCreateBrand({
                name: form.name.trim(),
                country: form.country.trim() || null,
                logoUrl: form.logoUrl.trim() || null,
                posterUrl: form.posterUrl.trim() || null,
                description: form.description.trim() || null
            });

            if (res?.err === 0) {
                toast.success("Tạo thương hiệu thành công");
                dispatch(getAllBrandsAdmin());
                navigate(-1);
            } else {
                toast.error(res?.msg || "Tạo thương hiệu thất bại");
            }
        } catch (error) {
            toast.error("Có lỗi khi tạo thương hiệu");
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
                <h3 className="text-xl font-bold text-gray-800">
                    Tạo thương hiệu mới
                </h3>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <InputField
                    label="Tên thương hiệu"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ví dụ: Dior, Chanel..."
                    required   //browser validate
                />

                <InputField
                    label="Quốc gia"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="France, Italy..."
                    required
                />

                <InputField
                    type="url"
                    label="Logo URL"
                    name="logoUrl"
                    value={form.logoUrl}
                    onChange={handleChange}
                    placeholder="http://..."
                    required
                />

                <InputField
                    label="Poster URL"
                    name="posterUrl"
                    value={form.posterUrl}
                    placeholder="http://..."
                    onChange={handleChange}
                />

                <InputField
                    label="Mô tả"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả về thương hiệu"
                    type="textarea"
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

export default BrandCreate;
