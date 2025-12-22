import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  InputField,
  SelectField,
  CheckRadioField,
} from "../../../components";
import { getAllBrandsAdmin } from "../../../store/actions/brand";
import { getAllCategoriesAdmin } from "../../../store/actions/category";
import {
  apiGetProductDetail,
  apiUpdateProduct,
  apiCreateVariant,
  apiAddProductImages,
  apiDeleteVariant,
  apiDeleteProductImage,
  apiSetThumbnail,
} from "../../../api/product";
import { getImageUrl } from "../../../utils";

const genderOptions = [
  { id: "nam", name: "Nam" },
  { id: "nữ", name: "Nữ" },
  { id: "unisex", name: "Unisex" },
];

const ProductUpdate = () => {
  const { id: productId } = useParams(); // lấy id từ URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { adminBrandList } = useSelector((state) => state.brand);
  const { adminCategoryList } = useSelector((state) => state.category);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    brandId: "",
    gender: "",
    origin: "",
    releaseYear: null,
    fragranceGroup: "",
    style: "",
    description: "",
  });

  const [scent, setScent] = useState({
    top: "",
    middle: "",
    base: "",
  });

  const [categoryIds, setCategoryIds] = useState([]);

  const [variants, setVariants] = useState([]); // variant hiện có từ DB
  const [newImages, setNewImages] = useState([]); // ảnh mới chọn để upload
  const [existingImages, setExistingImages] = useState([]); // ảnh cũ từ DB

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getAllBrandsAdmin());
    dispatch(getAllCategoriesAdmin());

    const fetchProduct = async () => {
      try {
        const res = await apiGetProductDetail(productId);
        if (res.err !== 0) {
          toast.error(res.msg || "Không tải được sản phẩm");
          navigate(-1);
          return;
        }

        const product = res.response;

        // Fill form cơ bản
        setForm({
          name: product.name || "",
          brandId: product.brand?.id || "",
          gender: product.gender || "",
          origin: product.origin || "",
          releaseYear: product.releaseYear || null,
          fragranceGroup: product.fragranceGroup || "",
          style: product.style || "",
          description: product.description || "",
        });

        // Scent notes
        if (product.scentNotes) {
          // Tách bằng ; (và cả \n nếu có, để tương thích cũ)
          const parts = product.scentNotes
            .split(/;|\n/)
            .map((p) => p.trim())
            .filter((p) => p.length > 0);

          const getValue = (prefix) => {
            const part = parts.find((p) => p.startsWith(prefix + ":"));
            return part ? part.replace(prefix + ":", "").trim() : "";
          };

          setScent({
            top: getValue("Hương đầu"),
            middle: getValue("Hương giữa"),
            base: getValue("Hương cuối"),
          });
        } else setScent({ top: "", middle: "", base: "" });

        // Categories
        setCategoryIds(product.categories?.map((cat) => cat.id) || []);

        // Variants
        setVariants(product.variants || []);

        // Images
        setExistingImages(product.images || []);

        setLoading(false);
      } catch (error) {
        toast.error("Lỗi khi tải sản phẩm");
        navigate(-1);
      }
    };

    fetchProduct();
  }, [dispatch, productId, navigate]);

  /* =========================
            HANDLERS
        ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const handleScentChange = (e) => {
    const { name, value } = e.target;
    setScent((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (id) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (errors.categoryIds) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.categoryIds;
        return newErr;
      });
    }
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        volume: "",
        originalPrice: "",
        stockQuantity: "",
        discountPercent: 0,
        isDefault: false,
      },
    ]);
  };

  const updateVariant = (index, key, value) => {
    const clone = [...variants];
    clone[index][key] = value;
    setVariants(clone);
  };

  const deleteVariant = async (variantId, index) => {
    if (variantId) {
      // Variant đã tồn tại trong DB → gọi API xóa
      const res = await apiDeleteVariant(variantId);
      if (res.err !== 0) {
        toast.error("Xóa variant thất bại");
        return;
      }
    }
    // Xóa khỏi state
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const setDefaultVariant = (index) => {
    setVariants((prev) =>
      prev.map((v, i) => ({
        ...v,
        isDefault: i === index,
      }))
    );
  };

  const deleteImage = async (imageId, index) => {
    if (imageId) {
      const res = await apiDeleteProductImage(imageId);
      if (res.err !== 0) {
        toast.error("Xóa ảnh thất bại");
        return;
      }
    }
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* =========================
        VALIDATE
    ========================= */
  const validateForm = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Tên sản phẩm bắt buộc";
    if (!form.gender) err.gender = "Vui lòng chọn giới tính";
    if (!form.brandId) err.brandId = "Vui lòng chọn thương hiệu";
    if (categoryIds.length === 0)
      err.categoryIds = "Vui lòng chọn ít nhất 1 danh mục";

    const filledVariants = variants.filter(
      (v) =>
        v.volume?.trim() || v.originalPrice?.trim() || v.stockQuantity?.trim()
    );

    filledVariants.forEach((v, i) => {
      if (
        !v.volume?.trim() ||
        !v.originalPrice?.trim() ||
        !v.stockQuantity?.trim()
      ) {
        err[`variant_${i}`] = "Vui lòng nhập đủ: dung tích, giá và số lượng";
      }
    });

    const hasDefault = variants.some((v) => v.isDefault);
    if (filledVariants.length > 0 && !hasDefault) {
      toast.error("Phải chọn 1 phiên bản mặc định");
      return false;
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* =========================
        SUBMIT UPDATE
    ========================= */
  const handleSubmit = async () => {
    setErrors({});

    if (!validateForm()) return;

    const scentParts = [];
    if (scent.top.trim()) scentParts.push(`Hương đầu: ${scent.top.trim()}`);
    if (scent.middle.trim())
      scentParts.push(`Hương giữa: ${scent.middle.trim()}`);
    if (scent.base.trim()) scentParts.push(`Hương cuối: ${scent.base.trim()}`);
    const scentNotes = scentParts.length > 0 ? scentParts.join("; ") : "";

    const payload = {
      ...form,
      scentNotes,
      categoryIds,
    };

    try {
      // 1. Update product cơ bản + category
      const res = await apiUpdateProduct(productId, payload);
      if (res?.err !== 0) {
        toast.error(res?.msg || "Cập nhật thất bại");
        return;
      }

      // 2. Tạo variant mới (chỉ những chưa có id)
      const newVariants = variants.filter((v) => !v.id);
      if (newVariants.length > 0) {
        for (const v of newVariants) {
          const variantPayload = {
            volume: Number(v.volume),
            originalPrice: Number(v.originalPrice),
            price: Math.round(
              (Number(v.originalPrice) *
                (100 - Number(v.discountPercent || 0))) /
                100
            ),
            stockQuantity: Number(v.stockQuantity),
            discountPercent: Number(v.discountPercent || 0),
            isDefault: v.isDefault,
          };
          const vRes = await apiCreateVariant(productId, variantPayload);
          if (vRes?.err !== 0) {
            toast.warn(`Tạo variant mới thất bại: ${vRes.msg}`);
          }
        }
      }

      // 3. Upload ảnh mới
      if (newImages.length > 0) {
        const imagePayload = {
          images: newImages.map((img) => img.file || img),
        };
        const uploadRes = await apiAddProductImages(productId, imagePayload);
        if (uploadRes?.err !== 0) {
          toast.warn("Upload ảnh mới thất bại");
        }
      }

      toast.success("Cập nhật sản phẩm thành công!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật sản phẩm");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Cập nhật sản phẩm</h2>

      <InputField
        label="Tên sản phẩm"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <SelectField
        label="Thương hiệu"
        name="brandId"
        value={form.brandId}
        options={adminBrandList?.data || []}
        onChange={handleChange}
        error={errors.brandId}
        required
      />

      <SelectField
        label="Giới tính"
        name="gender"
        value={form.gender}
        options={genderOptions}
        onChange={handleChange}
        error={errors.gender}
        required
      />

      {/* CATEGORY */}
      <div>
        <p className="font-semibold mb-2">Danh mục</p>
        <div className="grid grid-cols-3 gap-2">
          {adminCategoryList?.data?.map((cat) => (
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

      <InputField
        label="Xuất xứ"
        name="origin"
        value={form.origin}
        onChange={handleChange}
      />
      <InputField
        label="Năm phát hành"
        name="releaseYear"
        value={form.releaseYear}
        onChange={handleChange}
      />
      <InputField
        label="Nhóm hương"
        name="fragranceGroup"
        value={form.fragranceGroup}
        onChange={handleChange}
      />
      <InputField
        label="Phong cách"
        name="style"
        value={form.style}
        onChange={handleChange}
      />

      <h3 className="font-semibold">Hương thơm</h3>
      <InputField
        label="Hương đầu"
        name="top"
        value={scent.top}
        onChange={handleScentChange}
      />
      <InputField
        label="Hương giữa"
        name="middle"
        value={scent.middle}
        onChange={handleScentChange}
      />
      <InputField
        label="Hương cuối"
        name="base"
        value={scent.base}
        onChange={handleScentChange}
      />

      <InputField
        label="Mô tả"
        name="description"
        type="textarea"
        value={form.description}
        onChange={handleChange}
      />

      {/* HIỂN THỊ ẢNH HIỆN TẠI */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {existingImages.map((img, index) => (
          <div key={img.id} className="relative group">
            <img
              src={getImageUrl(img.url)}
              alt={`Ảnh ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
            />

            {/* Badge thumbnail hiện tại */}
            {img.isThumbnail && (
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                Thumbnail
              </div>
            )}

            {/* Nút đặt làm thumbnail (nếu chưa phải) */}
            {!img.isThumbnail && (
              <button
                type="button"
                onClick={async () => {
                  const res = await apiSetThumbnail(productId, {
                    imageId: img.id,
                  });
                  if (res.err === 0) {
                    // Cập nhật local state
                    setExistingImages((prev) =>
                      prev.map((i) => ({
                        ...i,
                        isThumbnail: i.id === img.id,
                      }))
                    );
                    toast.success("Đặt làm thumbnail thành công");
                  } else {
                    toast.error("Thất bại");
                  }
                }}
                className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                Đặt thumbnail
              </button>
            )}

            {/* Nút xóa */}
            <button
              type="button"
              onClick={() => deleteImage(img.id, index)}
              className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* UPLOAD ẢNH MỚI */}
      <div className="mt-6">
        <InputField
          label="Thêm hình ảnh mới"
          type="file"
          multiple
          images={newImages}
          setImages={setNewImages}
        />
        {newImages.length > 0 && (
          <p className="text-sm text-blue-600 mt-2">
            Lưu ý: Ảnh đầu tiên trong danh sách mới sẽ được tự động đặt làm
            thumbnail nếu chưa có thumbnail nào.
          </p>
        )}
      </div>

      {/* VARIANTS */}
      <h3 className="font-semibold">Dung tích</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-100 text-sm font-medium px-3 py-2">
          <span>Dung tích (ml)</span>
          <span>Giá gốc</span>
          <span>Số lượng</span>
          <span>Giảm (%)</span>
          <span className="text-center">Mặc định</span>
          <span className="text-center">Xóa</span>
        </div>

        {variants.map((v, i) => (
          <div
            key={v.id || i}
            className="grid grid-cols-7 items-center gap-2 px-3 py-2 border-t"
          >
            <InputField
              value={v.volume}
              onChange={(e) => updateVariant(i, "volume", e.target.value)}
              className="!mb-0"
            />
            <InputField
              value={v.originalPrice}
              onChange={(e) =>
                updateVariant(i, "originalPrice", e.target.value)
              }
              className="!mb-0"
            />
            <InputField
              value={v.stockQuantity}
              onChange={(e) =>
                updateVariant(i, "stockQuantity", e.target.value)
              }
              className="!mb-0"
            />
            <InputField
              value={v.discountPercent}
              onChange={(e) =>
                updateVariant(i, "discountPercent", e.target.value)
              }
              className="!mb-0"
            />
            <div className="flex justify-center">
              <input
                type="radio"
                checked={v.isDefault}
                onChange={() => setDefaultVariant(i)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => deleteVariant(v.id, i)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button
        text="Thêm dung tích"
        bgColor="bg-gray-200"
        textColor="text-black"
        onClick={addVariant}
      />

      <div className="flex gap-4">
        <Button text="Cập nhật sản phẩm" onClick={handleSubmit} />
        <Button text="Hủy" bgColor="bg-gray-300" onClick={() => navigate(-1)} />
      </div>
    </div>
  );
};

export default ProductUpdate;
