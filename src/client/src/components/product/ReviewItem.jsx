//1 review đơn
import {getImageUrl, formatDate} from '../../utils/index'

// Hàm helper tạo màu random từ mảng màu có sẵn
const getRandomColor = () => {
    const colors = [
        "bg-red-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-teal-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const ReviewItem = ({ review }) => {
    const reviewerName = `${review.user.firstname} ${review.user.lastname}`;
    const avatarColor = getRandomColor();
    return (
        <div className="bg-white p-4 rounded-lg shadow border space-y-2">
            <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold ${avatarColor}`}>
                    {reviewerName[0]}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">{reviewerName}</span>
                    <div className="flex text-yellow-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i}>★</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <h4 className="font-semibold">{review.title}</h4>
                <p className="text-gray-700">{review.content}</p>
                {review.reviewImages && review.reviewImages.length > 0 && (
                    <div className="flex space-x-3 py-2">
                        {review.reviewImages
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((img) => (
                                <img key={img.id} src={getImageUrl(img.url)} alt="review" className="w-[4.35rem] h-[4.5rem] object-cover rounded border" />
                            )
                        )}
                    </div>
                )}
                <p className="text-gray-600 text-sm italic">{formatDate(review.createdAt)}</p>
            </div>
        </div>
    );
};

export default ReviewItem;
