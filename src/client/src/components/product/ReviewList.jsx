// Danh sách review
import {ReviewItem, ReviewModal} from "../index";
import { useState } from "react";
const ReviewList = ({ reviews }) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div className="space-y-4">
            {reviews?.length > 0 ?
                (
                    reviews.map((review, idx) => (
                        <ReviewItem key={idx} review={review} />
                    ))
                ) : (
                    <p className="text-gray-500 text-lg text-left">
                        Chưa có bình luận nào cho sản phẩm này.
                    </p>
                )
            }

            {openModal && <ReviewModal onClose={() => setOpenModal(false)} />}
        </div>
    );
};

export default ReviewList;
