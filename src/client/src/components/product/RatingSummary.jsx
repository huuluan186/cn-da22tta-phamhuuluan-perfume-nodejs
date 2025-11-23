// Khối tổng quan đánh giá
import icons from '../../assets/react-icons/icon'
const {MdStar} = icons;

const RatingSummary = ({ reviews = [], onRateClick }) => {
    // Mặc định nếu không có review
    const totalReviews = reviews.length;

    // Tính số lượng từng sao: index 0 → 5 sao, index 4 → 1 sao
    const ratingsCount = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
        const star = Math.min(Math.max(r.rating, 1), 5);
        ratingsCount[5 - star] += 1;
    });

    // Tính trung bình
    const average =
        totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;

    // Tính % từng sao
    const ratingPercent = ratingsCount.map(r => Math.round((r / (totalReviews || 1)) * 100));

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-4xl border">
            <div className="flex items-stretch justify-center">

                {/* Cột 1: Tổng số sao trung bình */}
                <div className="flex flex-col items-center justify-center w-1/4 text-center border-r border-gray-300 ">
                    <div className="text-5xl font-bold text-yellow-400">
                        {Number(average).toFixed(1)}
                    </div>
                    <div className="text-gray-600 font-medium">Đánh giá trung bình</div>
                </div>

                {/* Cột 2: Thanh % từng sao */}
                <div className="flex-1 px-4 border-r border-gray-300">
                    {ratingsCount.map((count, idx) => {
                        const star = 5 - idx;
                        return (
                            <div
                                key={idx}
                                className="grid grid-cols-[auto_11rem_1fr] items-center gap-2 mb-2 p-1 rounded"
                            >
                                {/* Phần 1: số sao */}
                                <div className="flex items-center gap-1 justify-start">
                                    <span className="text-base leading-none">{star}</span>
                                    <MdStar className="text-base" />
                                </div>

                                {/* Phần 2: thanh vàng */}
                                <div className="h-4 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className="h-4 bg-yellow-400 rounded"
                                        style={{ width: `${ratingPercent[idx]}%` }}
                                    >
                                    </div>
                                </div>

                                {/* Phần 3: text còn lại */}
                                <div className="text-sm text-right">
                                    {ratingPercent[idx]}% | {count} đánh giá
                                </div>
                            </div>
                        );
                    })}
                </div>


                {/* Cột 3: Nút đánh giá ngay */}
                <div className="w-1/4 flex items-center justify-center pl-4">
                    <button
                        onClick={onRateClick}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                    >
                        Đánh giá ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingSummary;
