// Khối tổng quan đánh giá
import icons from '../../assets/react-icons/icon'
import { Button } from '../../components/index'

const {MdStar} = icons;

const RatingSummary = ({ avgRating, totalReviews, reviews = [], onRateClick }) => {

    // Tính số lượng từng sao: index 0 → 5 sao, index 4 → 1 sao
    const ratingsCount = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
        const star = Math.min(Math.max(r.rating, 1), 5);
        ratingsCount[5 - star] += 1;
    });

    // Tính % từng sao
    const ratingPercent = ratingsCount.map(r => Math.round((r / (totalReviews || 1)) * 100));

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-4xl border">
            <div className="flex items-stretch justify-center">

                {/* Cột 1: Tổng số sao trung bình */}
                <div className="flex flex-col items-center justify-center w-1/4 text-center border-r border-gray-300 ">
                    <div className="text-5xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                        <span>{avgRating}</span> 
                        <MdStar/>
                    </div>
                    <div className="text-gray-600 font-medium">ĐÁNH GIÁ TRUNG BÌNH</div>
                </div>

                {/* Cột 2: Thanh % từng sao */}
                <div className="flex-1 px-4 border-r border-gray-300">
                    {ratingsCount.map((count, idx) => {
                        const star = 5 - idx;
                        return (
                            <div
                                key={idx}
                                className="grid grid-cols-[auto_12rem_1fr] items-center gap-2 mb-2 p-1 rounded"
                            >
                                {/* Phần 1: số sao */}
                                <div className="flex items-center gap-1 justify-start">
                                    <span className="text-base leading-none">{star}</span>
                                    <MdStar className="text-base" />
                                </div>

                                {/* Phần 2: thanh vàng */}
                                <div className="h-4 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className="h-4 bg-yellow-500 rounded"
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
                    <Button
                        onClick={onRateClick}
                        text={'Đánh giá ngay'}
                        textColor='text-white'
                        bgColor='bg-primary'
                        hoverBg='hover:bg-green-800'
                        hoverText='hover:none'
                        outline='rounded'
                        className="px-6 py-3"
                    />

                </div>
            </div>
        </div>
    );
};

export default RatingSummary;
