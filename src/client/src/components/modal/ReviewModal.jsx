//Modal đánh giá sản phẩm
import { useState } from "react";
import { getImageUrl } from "../../utils/index"
import icons from '../../assets/react-icons/icon'
import { Button, InputField } from "../index";
import { apiAddProductReview } from "../../api/product";
import { toast } from "react-toastify";

const {MdCancel, MdStar} = icons;

const ReviewModal = ({ product, onClose }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({});

    const ratingLabels = ["Rất tệ", "Không tệ", "Trung bình", "Tốt", "Tuyệt vời"];

    const validate = () => {
        let newErrors = {};

        if (!title.trim()) newErrors.title = "Tiêu đề không được để trống";
        if (!content.trim()) newErrors.content = "Nội dung không được để trống";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        if (field === "title") setTitle(value);
        if (field === "content") setContent(value);

        // xoá lỗi của field này
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        setErrors({});

        if (!validate()) return; // nếu lỗi thì không gửi API
        const payload = {
            orderItemId: 'new_4' || product.orderItemId, //hard orderItem id data
            title,
            content,
            rating,
            images: images.map(i => i.file), 
        };

        try {
            const res = await apiAddProductReview(product.id, payload);
            if(res?.err === 0) onClose(); // gọi về ProductDetail để reload review
        } catch (err) {
            const message = err?.response?.data?.msg || "Đã xảy ra lỗi!";
            toast.error(message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white py-5 px-6 rounded-lg w-full max-w-xl h-[95vh] max-h-[100vh] space-y-4 overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Đánh giá sản phẩm</h2>
                    <MdCancel 
                        className="text-3xl text-red-400 cursor-pointer" 
                        onClick={()=>onClose(false)}
                    />
                </div>
               
                {/* ==== THÔNG TIN SẢN PHẨM ==== */}
                {product && (
                    <div className="flex items-center gap-4 border-b pb-4">
                        <img
                            src={product?.images?.find(i => i.isThumbnail)?.url
                                ? getImageUrl(product.images.find(i => i.isThumbnail).url)
                                : ""}
                            alt="thumb"
                            className="w-32 h-36 object-contain rounded"
                        />

                        <div className="space-y-1">
                            {product.gender && (
                                <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded text-sm">
                                    {product.gender}
                                </span>
                            )}

                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-600">
                                Thương hiệu: <span className="font-medium">{product.brand.name}</span>
                            </p>
                        </div>
                    </div>
                )}

                <div>
                    <InputField
                        label="Tiêu đề (0/50)"
                        name="title"
                        type="text"
                        value={title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        error={errors.title}
                        setError={setErrors}
                        required={true}
                    />
                </div>

                <div>
                    <InputField
                        label="Mô tả (0/800)"
                        name="content"
                        type="textarea"
                        value={content}
                        onChange={(e) => handleChange("content", e.target.value)}
                        error={errors.content}
                        setError={setErrors}
                        required={true}
                    />
                </div>

                <div>
                    <InputField
                        label="Hình ảnh"
                        type="file"
                        name="images"
                        images={images}
                        setImages={setImages}
                        multiple={true}
                    />
                </div>

                <div className="py-4">
                    <p className="font-semibold text-gray-800 mb-2">
                        Bạn cảm thấy thế nào về sản phẩm? (Chọn sao)
                    </p>

                    <div className="flex items-center gap-6" onMouseLeave={() => setHover(0)}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className="flex flex-col items-center transition-transform duration-150 hover:scale-125">
                                <MdStar
                                    size={34}
                                    className="cursor-pointer"
                                    color={(hover || rating) >= star ? "#FFA500" : "#999999"} 
                                    onMouseEnter={() => setHover(star)}
                                    //onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                />

                                {/* Label dưới mỗi sao */}
                                <span className="text-sm text-gray-500 mt-1">
                                    {ratingLabels[star - 1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="flex justify-center gap-4">
                    <Button
                        text={'Gửi đánh giá'}
                        width="w-60"
                        bgColor="bg-red-600"
                        hoverBg="hover:bg-red-500"
                        hoverText="hover:none"
                        outline='rounded'
                        onClick={handleSubmit}
                    />
                    <Button
                        text={'Hủy'}
                        width="w-36"
                        bgColor="bg-gray-300"
                        textColor="text-black"
                        hoverBg="hover:bg-gray-400"
                        hoverText="hover:none"
                        outline='rounded'
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
