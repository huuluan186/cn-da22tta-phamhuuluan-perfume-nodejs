//1 review đơn
const ReviewItem = ({ review }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow border space-y-2">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                    {review.name[0]}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">{review.name}</span>
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
                {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2">
                        {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt="review" className="w-16 h-16 object-cover rounded" />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex space-x-4 text-blue-600 text-sm">
                <button>Hữu ích</button>
                <button>Bình luận</button>
            </div>
        </div>
    );
};

export default ReviewItem;
