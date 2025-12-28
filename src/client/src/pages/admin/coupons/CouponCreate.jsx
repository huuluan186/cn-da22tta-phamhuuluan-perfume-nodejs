// src/pages/admin/coupon/CouponCreate.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, InputField, CheckRadioField } from "../../../components";
import { apiCreateCoupon } from "../../../api/coupon";
import { toast } from "react-toastify";

const CouponCreate = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        code: "",
        discountType: "fixed", // mặc định fixed
        discountValue: "",
    });

    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDiscountTypeChange = (e) => {
        const newType = e.target.value;
        setForm(prev => ({
            ...prev,
            discountType: newType,
            discountValue: "" // reset giá trị khi đổi loại để tránh lỗi validate cũ
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // === VALIDATE BẰNG JS THUẦN ===
        if (!form.code.trim()) {
            toast.error("Mã giảm giá là bắt buộc");
            return;
        }

        if (form.code.trim().length < 3) {
            toast.error("Mã giảm giá phải có ít nhất 3 ký tự");
            return;
        }

        if (!form.discountValue || Number(form.discountValue) <= 0) {
            toast.error("Giá trị giảm là bắt buộc và phải lớn hơn 0");
            return;
        }

        if (form.discountType === "percentage" && Number(form.discountValue) > 100) {
            toast.error("Giảm phần trăm không được vượt quá 100%");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                code: form.code.trim(),
                discountType: form.discountType,
                discountValue: Number(form.discountValue),
                validFrom: form.validFrom,
                validUntil: form.validUntil || null,
            };

            const res = await apiCreateCoupon(payload);

            if (res?.err === 0) {
                toast.success(`Tạo mã giảm giá "${payload.code}" thành công!`);
                navigate(-1); // Quay về trang list
            } else {
                toast.error(res?.msg || "Tạo mã giảm giá thất bại");
            }
        } catch (error) {
            const msg = error?.msg || "Có lỗi khi tạo mã giảm giá";
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
                <h3 className="text-xl font-bold">Tạo mã giảm giá</h3>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Mã coupon */}
                <InputField
                    label="Mã coupon"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="WELCOME, SALE2025, FREESHIP..."
                    required
                />

                {/* Loại giảm giá - Radio */}
                <div>
                    <label className="block text-sm font-medium mb-3">Loại giảm giá</label>
                    <div className="flex items-center gap-8">
                        <CheckRadioField
                            type="radio"
                            name="discountType"
                            value="fixed"
                            checked={form.discountType === "fixed"}
                            onChange={handleDiscountTypeChange}
                            label="Giảm tiền cố định (₫)"
                            labelTxtSize="text-base"
                        />
                        <CheckRadioField
                            type="radio"
                            name="discountType"
                            value="percentage"
                            checked={form.discountType === "percentage"}
                            onChange={handleDiscountTypeChange}
                            label="Giảm theo phần trăm (%)"
                            labelTxtSize="text-base"
                        />
                    </div>
                </div>

                {/* Giá trị giảm */}
                <InputField
                    type="number"
                    label="Giá trị giảm"
                    name="discountValue"
                    value={form.discountValue}
                    onChange={handleChange}
                    placeholder={form.discountType === "fixed" ? "20000" : "15"}
                    min="1"
                    max={form.discountType === "percentage" ? "100" : undefined}
                    required
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
                    text={saving ? "Đang tạo..." : "Tạo mã giảm giá"}
                    width="w-32"
                    outline="rounded-md"
                    hoverBg="hover:bg-primary/80"
                    hoverText="hover:none"
                    className={saving ? "opacity-70 pointer-events-none" : ""}
                />
            </div>
        </form>
    );
};

export default CouponCreate;