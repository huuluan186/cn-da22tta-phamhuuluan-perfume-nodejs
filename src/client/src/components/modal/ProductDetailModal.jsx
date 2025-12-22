import { getImageUrl, formatDateTime } from "../../utils";

const parseScentNotes = (text = "") => {
    const result = {
        top: [],
        middle: [],
        base: [],
    };

    if (!text) return result;

    text.split(";").forEach((part) => {
        const [label, values] = part.split(":");
        if (!values) return;

        const notes = values
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);

        if (label.includes("Hương đầu")) result.top = notes;
        if (label.includes("Hương giữa")) result.middle = notes;
        if (label.includes("Hương cuối")) result.base = notes;
    });

    return result;
};

const ProductDetailModal = ({ product }) => {
    if (!product) return null;

    const scent = parseScentNotes(product.scentNotes);

    return (
        <div className="space-y-6 text-sm">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="text-gray-500">{product.brand?.name || "—"}</p>
                </div>

                <span
                    className={`px-3 py-1 text-xs rounded-full ${product.deletedAt
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                >
                    {product.deletedAt ? "Ngừng bán" : "Đang bán"}
                </span>
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-4">
                <div><b>ID:</b> {product.id}</div>
                <div><b>Giới tính:</b> {product.gender || "—"}</div>
                <div><b>Xuất xứ:</b> {product.origin || "—"}</div>
                <div><b>Năm phát hành:</b> {product.releaseYear || "—"}</div>
                <div><b>Nhóm hương:</b> {product.fragranceGroup || "—"}</div>
                <div><b>Phong cách:</b> {product.style || "—"}</div>
            </div>

            {/* SCENT NOTES */}
            <div>
                <h4 className="font-semibold mb-2">Scent Notes</h4>

                <div className="space-y-2">
                    {[
                        { label: "Hương đầu", data: scent.top },
                        { label: "Hương giữa", data: scent.middle },
                        { label: "Hương cuối", data: scent.base },
                    ].map(({ label, data }) => (
                        <div key={label}>
                            <b className="text-gray-700">{label}:</b>{" "}
                            {data.length ? (
                                <div className="inline-flex flex-wrap gap-2 ml-2">
                                    {data.map((n, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-700"
                                        >
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="ml-2 text-gray-400">—</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* CATEGORIES */}
            <div>
                <h4 className="font-semibold mb-1">Danh mục</h4>
                <div className="flex gap-2 flex-wrap">
                    {product.categories?.length
                        ? product.categories.map((c) => (
                            <span
                                key={c.id}
                                className="px-2 py-1 text-xs rounded bg-gray-100"
                            >
                                {c.name}
                            </span>
                        ))
                        : "—"
                    }
                </div>
            </div>

            {/* DESCRIPTION (giới hạn chiều cao) */}
            {product.description && (
                <div>
                    <h4 className="font-semibold mb-1">Mô tả</h4>
                    <div
                        className="max-h-40 overflow-y-auto text-gray-700 leading-relaxed border rounded p-3 bg-gray-50 whitespace-pre-wrap text-justify"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    ></div>
                </div>
            )}

            {/* IMAGES */}
            {product.images?.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2">Hình ảnh</h4>
                    <div className="grid grid-cols-[repeat(auto-fill,96px)] gap-3">
                        {product.images.map((img) => (
                            <div
                                key={img.id}
                                className={`w-24 h-24 rounded overflow-hidden border ${img.isThumbnail ? "ring-2 ring-blue-500" : ""
                                    }`}
                            >
                                <img
                                    src={getImageUrl(img.url)}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VARIANTS */}
            <div>
                <h4 className="font-semibold mb-2">
                    Dung tích ({product.variants?.length || 0})
                </h4>

                {product.variants?.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-2 py-1">SKU</th>
                                    <th className="px-2 py-1">Dung tích</th>
                                    <th className="px-2 py-1">Tồn kho</th>
                                    <th className="px-2 py-1">Đã bán</th>
                                    <th className="px-2 py-1">Giá ban đầu</th>
                                    <th className="px-2 py-1">Giảm (%)</th>
                                    <th className="px-2 py-1">Giá cuối</th>
                                    <th className="px-2 py-1">Mặc định</th>
                                    <th className="px-2 py-1">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.variants.map((v) => (
                                    <tr key={v.id} className="border-t text-center">
                                        <td>{v.sku}</td>
                                        <td>{v.volume}ml</td>
                                        <td>{v.stockQuantity}</td>
                                        <td>{v.soldQuantity}</td>
                                        <td>{Number(v.originalPrice).toLocaleString()}₫</td>
                                        <td>{v.discountPercent}</td>
                                        <td>{Number(v.price).toLocaleString()}₫</td>
                                        <td>
                                            {v.isDefault && (
                                                <span className="text-green-600 font-bold">✔</span>
                                            )}
                                        </td>
                                        <td>
                                            {v.deletedAt ? (
                                                <span className="text-red-600 font-medium">Đã xóa</span>
                                            ) : (
                                                <span className="text-green-600 font-medium">
                                                    Đang bán
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <span className="text-red-500">Chưa có phiên bản</span>
                )}
            </div>

            {/* META INFO */}
            <div className="pt-4 border-t text-xs text-gray-500 grid grid-cols-2 gap-2">
                <div><b>Ngày tạo:</b> {formatDateTime(product.createdAt)}</div>
                <div><b>Cập nhật:</b> {formatDateTime(product.updatedAt)}</div>
                <div><b>Ngày xóa:</b>{" "}{product.deletedAt ? formatDateTime(product.deletedAt) : "—"}</div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
