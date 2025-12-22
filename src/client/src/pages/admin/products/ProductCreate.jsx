import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, InputField, SelectField, CheckRadioField } from "../../../components";
import { getAllBrandsAdmin } from "../../../store/actions/brand";
import { getAllCategoriesAdmin } from "../../../store/actions/category";
import { apiCreateProduct, apiCreateVariant, apiAddProductImages } from "../../../api/product";

const genderOptions = [
    { id: "nam", name: "Nam" },
    { id: "nữ", name: "Nữ" },
    { id: "unisex", name: "Unisex" }
];

const ProductCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { adminBrandList } = useSelector(state => state.brand);
    const { adminCategoryList } = useSelector(state => state.category);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        name: "",
        brandId: "",
        gender: "",
        origin: "",
        releaseYear: null,
        fragranceGroup: "",
        style: "",
        description: ""
    });

    /* =========================
        SCENT NOTES
    ========================= */
    const [scent, setScent] = useState({
        top: "",
        middle: "",
        base: ""
    });

    /* =========================
        CATEGORY
    ========================= */
    const [categoryIds, setCategoryIds] = useState([]);

    /* =========================
        VARIANTS
    ========================= */
    const [variants, setVariants] = useState([
        {
            volume: "",
            originalPrice: "",
            stockQuantity: "",
            discountPercent: 0,
            isDefault: true
        }
    ]);

    /* =========================
        IMAGES
    ========================= */
    const [images, setImages] = useState([]);

    /* =========================
        LOAD DATA
    ========================= */
    useEffect(() => {
        dispatch(getAllBrandsAdmin());
        dispatch(getAllCategoriesAdmin());
    }, [dispatch]);

    /* =========================
        HANDLERS
    ========================= */
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Clear lỗi của field đó ngay khi nhập
        if (errors[name]) {
            setErrors(prev => {
                const newErr = { ...prev };
                delete newErr[name];
                return newErr;
            });
        }
    };

    const handleScentChange = e => {
        const { name, value } = e.target;
        setScent(prev => ({ ...prev, [name]: value }));
    };

    const toggleCategory = id => {
        setCategoryIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
        // Nếu đã có lỗi categoryIds → clear khi người dùng tương tác
        if (errors.categoryIds) {
            setErrors(prev => {
                const newErr = { ...prev };
                delete newErr.categoryIds;
                return newErr;
            });
        }
    };

    const addVariant = () => {
        setVariants(prev => [
            ...prev,
            {
                volume: "",
                originalPrice: "",
                stockQuantity: "",
                discountPercent: 0,
                isDefault: false
            }
        ]);
    };

    const updateVariant = (index, key, value) => {
        const clone = [...variants];
        clone[index][key] = value;
        setVariants(clone);
    };

    const setDefaultVariant = index => {
        setVariants(
            variants.map((v, i) => ({
                ...v,
                isDefault: i === index
            }))
        );
    };

    /* =========================
        VALIDATE 
    ========================= */
    const isVariantFilled = (v) => {
        return v.volume.trim() || v.originalPrice.trim() || v.stockQuantity.trim();
    };

    const isVariantComplete = (v) => {
        return v.volume.trim() && v.originalPrice.trim() && v.stockQuantity.trim();
    };

    const validateForm = () => {
        const err = {};

        if (!form.name.trim()) err.name = "Tên sản phẩm bắt buộc";
        if (!form.gender) err.gender = "Vui lòng chọn giới tính";
        if (!form.brandId) err.brandId = "Vui lòng chọn thương hiệu";
        if (categoryIds.length === 0)
            err.categoryIds = "Vui lòng chọn ít nhất 1 danh mục";

        // Kiểm tra variant: chỉ validate những variant đã được nhập ít nhất 1 field
        let hasAnyVariant = false;

        variants.forEach((v, i) => {
            if (isVariantFilled(v)) {
                hasAnyVariant = true;
                if (!isVariantComplete(v)) {
                    err[`variant_${i}`] = "Vui lòng nhập đủ: dung tích, giá và số lượng";
                }
            }
        });

        // Nếu có ít nhất 1 variant được nhập → phải có 1 cái mặc định
        if (hasAnyVariant && !variants.some(v => v.isDefault)) {
            toast.error("Phải chọn 1 phiên bản mặc định cho các dung tích đã nhập");
            return false;
        }
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    /* =========================
        SUBMIT
    ========================= */
    const handleSubmit = async () => {
        setErrors({});
        if (!validateForm()) return;
        const scentParts = [];
        if (scent.top.trim()) scentParts.push(`Hương đầu: ${scent.top.trim()}`);
        if (scent.middle.trim()) scentParts.push(`Hương giữa: ${scent.middle.trim()}`);
        if (scent.base.trim()) scentParts.push(`Hương cuối: ${scent.base.trim()}`);

        const scentNotes = scentParts.length > 0 ? scentParts.join("; ") : "";

        // Lọc variant hợp lệ (đã nhập đủ 3 field chính)
        const validVariants = variants.filter(v =>
            v.volume.trim() && v.originalPrice.trim() && v.stockQuantity.trim()
        );

        // Payload chỉ chứa thông tin sản phẩm cơ bản + scentNotes + categoryIds
        // KHÔNG gửi variants và images nữa
        const payload = {
            ...form,
            scentNotes,
            categoryIds, // mảng id danh mục
        };

        try {
            // BƯỚC 1: Tạo sản phẩm cơ bản
            const res = await apiCreateProduct(payload);

            if (res?.err !== 0) {
                toast.error(res?.msg || "Tạo sản phẩm thất bại");
                return;
            }

            const productId = res.data?.id;

            if (!productId) {
                toast.error("Tạo sản phẩm thành công nhưng không nhận được ID!");
                return;
            }

            // BƯỚC 2: Tạo từng variant (nếu có)
            if (validVariants.length > 0) {
                for (const v of validVariants) {
                    const variantPayload = {
                        volume: Number(v.volume),
                        originalPrice: Number(v.originalPrice),
                        price: Math.round(
                            Number(v.originalPrice) * (100 - Number(v.discountPercent || 0)) / 100
                        ),
                        stockQuantity: Number(v.stockQuantity),
                        discountPercent: Number(v.discountPercent || 0),
                        isDefault: v.isDefault
                    };

                    const variantRes = await apiCreateVariant(productId, variantPayload);

                    if (variantRes?.err !== 0) {
                        toast.warn(`Tạo variant ${v.volume}ml thất bại: ${variantRes?.msg}`);
                    }
                }
            }

            // BƯỚC 3: Upload ảnh (nếu có)
            if (images.length > 0) {
                // Dùng objectToFormData để thống nhất code với phần review
                const imagePayload = {
                    images: images.map(img => img.file || img) // lấy File object
                };

                const uploadRes = await apiAddProductImages(productId, imagePayload);

                if (uploadRes?.err !== 0) {
                    toast.warn(`Upload ảnh thất bại: ${uploadRes?.msg}`);
                }
            }

            toast.success("Tạo sản phẩm thành công!");
            navigate(-1);
        } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            toast.error("Đã có lỗi xảy ra khi tạo sản phẩm");
        }
    };

    /* =========================
        RENDER (FULL UI)
    ========================= */
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Thêm sản phẩm</h2>

            <InputField
                label="Tên sản phẩm"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                setError={setErrors}
                required
            />

            <SelectField
                label="Thương hiệu"
                name="brandId"
                value={form.brandId}
                options={adminBrandList?.data || []}
                onChange={handleChange}
                error={errors.brandId}
                setError={setErrors}
                required
            />

            <SelectField
                label="Giới tính"
                name="gender"
                value={form.gender}
                options={genderOptions}
                onChange={handleChange}
                error={errors.gender}
                setError={setErrors}
                required
            />

            {/* ===== CATEGORY ===== */}
            <div>
                <p className="font-semibold mb-2">Danh mục</p>
                <div className="grid grid-cols-3 gap-2">
                    {adminCategoryList?.data?.map(cat => (
                        <CheckRadioField
                            key={cat.id}
                            label={cat.name}
                            checked={categoryIds.includes(cat.id)}
                            onChange={() => toggleCategory(cat.id)}
                        />
                    ))}
                </div>
                {errors.categoryIds && (
                    <p className="text-red-500 text-sm">{errors.categoryIds}</p>
                )}
            </div>

            {/* ===== GIỮ NGUYÊN TOÀN BỘ UI PHÍA DƯỚI ===== */}
            <InputField label="Xuất xứ" name="origin" value={form.origin} onChange={handleChange} />
            <InputField label="Năm phát hành" name="releaseYear" value={form.releaseYear} onChange={handleChange} />
            <InputField label="Nhóm hương" name="fragranceGroup" value={form.fragranceGroup} onChange={handleChange} />
            <InputField label="Phong cách" name="style" value={form.style} onChange={handleChange} />
            <h3 className="font-semibold">HƯƠNG THƠM (nhập không kèm theo bất kì dấu câu nào ở cuối câu)</h3>
            <InputField label="Hương đầu" name="top" value={scent.top} onChange={handleScentChange} />
            <InputField label="Hương giữa" name="middle" value={scent.middle} onChange={handleScentChange} />
            <InputField label="Hương cuối" name="base" value={scent.base} onChange={handleScentChange} />

            <InputField
                label="Mô tả"
                name="description"
                type="textarea"
                value={form.description}
                onChange={handleChange}
            />

            <div className="flex flex-col">
                <InputField
                    label="Hình ảnh"
                    type="file"
                    multiple
                    images={images}
                    setImages={setImages}
                />
                <p className="text-sm text-blue-600 mt-2">
                    Lưu ý: Ảnh đầu tiên bạn chọn sẽ được tự động đặt làm thumbnail (ảnh đại diện sản phẩm).
                </p>
            </div>

            {/* VARIANTS */}
            <h3 className="font-semibold">Dung tích</h3>

            <div className="border rounded-lg overflow-hidden">
                {/* HEADER */}
                <div className="grid grid-cols-6 bg-gray-100 text-sm font-medium px-3 py-2">
                    <span>Dung tích (ml)</span>
                    <span>Giá gốc</span>
                    <span>Số lượng</span>
                    <span>Giảm (%)</span>
                    <span className="text-center">Mặc định</span>
                    <span className="text-center">Xóa</span>
                </div>

                {/* ROWS */}
                {variants.map((v, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-6 items-center gap-2 px-3 py-2 border-t"
                    >
                        <InputField
                            value={v.volume}
                            onChange={e => updateVariant(i, "volume", e.target.value)}
                            className="!mb-0"
                        />

                        <InputField
                            value={v.originalPrice}
                            onChange={e => updateVariant(i, "originalPrice", e.target.value)}
                            className="!mb-0"
                        />

                        <InputField
                            value={v.stockQuantity}
                            onChange={e => updateVariant(i, "stockQuantity", e.target.value)}
                            className="!mb-0"
                        />

                        <InputField
                            value={v.discountPercent}
                            onChange={e => updateVariant(i, "discountPercent", e.target.value)}
                            className="!mb-0"
                        />

                        {/* DEFAULT */}
                        <div className="flex justify-center">
                            <input
                                type="radio"
                                checked={v.isDefault}
                                onChange={() => setDefaultVariant(i)}
                            />
                        </div>

                        {/* DELETE */}
                        <div className="flex justify-center">
                            {variants.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setVariants(prev => prev.filter((_, idx) => idx !== i))
                                    }
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    text="+ Thêm dung tích"
                    bgColor="bg-blue-600"
                    textColor="text-white"
                    hoverBg="hover:bg-blue-500"
                    hoverText="hover:none"
                    outline="rounded-md"
                    onClick={addVariant}
                />
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
                    text="Thêm"
                    hoverBg="hover:bg-primary/80"
                    hoverText="hover:none"
                    outline="rounded-md"
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
};

export default ProductCreate;
