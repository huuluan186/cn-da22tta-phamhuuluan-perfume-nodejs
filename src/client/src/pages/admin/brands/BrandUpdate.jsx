import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Button, InputField } from "../../../components";
import { apiUpdateBrand, apiGetBrandDetail } from "../../../api/brand";
import { getAllBrandsAdmin } from "../../../store/actions/brand";
import { toast } from "react-toastify";

const BrandUpdate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        country: "",
        logoUrl: "",
        posterUrl: "",
        description: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await apiGetBrandDetail(id);
                if (res?.data?.err === 0) {
                    setForm({
                        name: res.data.brand.name || "",
                        country: res.data.brand.country || "",
                        logoUrl: res.data.brand.logoUrl || "",
                        posterUrl: res.data.brand.posterUrl || "",
                        description: res.data.brand.description || ""
                    });
                } else {
                    toast.error("Không tìm thấy thương hiệu");
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
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const res = await apiUpdateBrand(id, {
                name: form.name.trim(),
                country: form.country.trim() || null,
                logoUrl: form.logoUrl.trim() || null,
                posterUrl: form.posterUrl.trim() || null,
                description: form.description.trim() || null
            });

            if (res?.err === 0) {
                toast.success("Cập nhật thương hiệu thành công");
                dispatch(getAllBrandsAdmin());
                navigate(-1);
            } else {
                toast.error(res?.msg || "Cập nhật thất bại");
            }
        } catch {
            toast.error("Có lỗi khi cập nhật thương hiệu");
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
        <div className="bg-white p-6 rounded-xl shadow-lg ring-1 ring-primary space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h3 className="text-xl font-bold">Cập nhật thương hiệu</h3>
            </div>

            <div className="space-y-4">
                <InputField label="Tên thương hiệu" name="name" value={form.name} onChange={handleChange} required />
                <InputField label="Quốc gia" name="country" value={form.country} onChange={handleChange} />
                <InputField label="Logo URL" name="logoUrl" value={form.logoUrl} onChange={handleChange} />
                <InputField label="Poster URL" name="posterUrl" value={form.posterUrl} onChange={handleChange} />
                <InputField label="Mô tả" name="description" value={form.description} onChange={handleChange} type="textarea" />
            </div>

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
                    text={saving ? "Đang lưu..." : "Lưu"}
                    hoverBg="hover:bg-primary/80"
                    hoverText="hover:none"
                    outline="rounded-md"
                    onClick={handleSubmit}
                    disabled={saving}
                />
            </div>
        </div>
    );
};

export default BrandUpdate;
