// components/product/ReviewList.jsx
import { ReviewItem, ReviewModal } from "../index";
import { useState } from "react";
import { useSelector } from "react-redux"; // giả sử bạn dùng Redux để lấy user

const ReviewList = ({ reviews = [] }) => {
    const [openModal, setOpenModal] = useState(false);

    // Lấy user hiện tại (điều chỉnh theo cách bạn lưu user)
    const currentUser = useSelector((state) => state.auth?.user); // ví dụ
    // Nếu dùng context hoặc props thì thay bằng: const { currentUser } = useAuth();

    const currentUserId = currentUser?.id;

    // Lọc review để hiển thị
    const visibleReviews = reviews.filter((review) => {
        const isNotDeleted = !review.deletedAt;

        // Quy tắc hiển thị:
        // - Chỉ cần bình luận chưa bị xóa là hiển thị
        return isNotDeleted;
    });

    return (
        <div className="space-y-6">
            {visibleReviews.length > 0 ? (
                visibleReviews.map((review, idx) => {
                    const isOwner = currentUserId && review.user?.id === currentUserId;
                    const isPendingApproval = !review.isApproved;

                    return (
                        <div key={review.id || idx} className="relative">
                            {/* Badge "Đang chờ duyệt" - chỉ hiện cho chủ bài và chỉ khi chưa duyệt */}
                            {isOwner && isPendingApproval && (
                                <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg z-10 shadow">
                                    Đang chờ duyệt
                                </div>
                            )}

                            {/* Badge "Đã bị xóa" - chỉ hiện cho chủ bài nếu bị soft delete */}
                            {isOwner && review.deletedAt && (
                                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg z-10 shadow">
                                    Đã bị xóa
                                </div>
                            )}

                            <ReviewItem review={review} />
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500 text-lg text-left py-8">
                    Chưa có bình luận nào cho sản phẩm này.
                </p>
            )}

            {/* Nút viết review - chỉ hiện nếu đã login */}
            {currentUser && (
                <button
                    onClick={() => setOpenModal(true)}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Viết đánh giá của bạn
                </button>
            )}

            {openModal && <ReviewModal onClose={() => setOpenModal(false)} />}
        </div>
    );
};

export default ReviewList;