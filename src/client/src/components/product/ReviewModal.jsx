//Modal đánh giá sản phẩm
import { useState } from "react";

const ReviewModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...urls]);
  };

  const handleSubmit = () => {
    console.log({ title, content, images });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold">Đánh giá sản phẩm</h2>

        <div className="space-y-2">
          <label className="block text-gray-700">Tiêu đề (0/50)</label>
          <input
            type="text"
            maxLength={50}
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">Mô tả (0/800)</label>
          <textarea
            maxLength={800}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700">Hình ảnh</label>
          <input type="file" multiple onChange={handleUpload} className="mt-1" />
          <div className="flex space-x-2 mt-2">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt="preview" className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onClose}>Hủy</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleSubmit}>Gửi đánh giá</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
