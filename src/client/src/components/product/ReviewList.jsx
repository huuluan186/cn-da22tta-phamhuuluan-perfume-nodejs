// Danh sách review
import {ReviewItem, ReviewModal} from "../index";
import { useState } from "react";
const ReviewList = ({ reviews }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-4">

      {reviews.map((review, idx) => (
        <ReviewItem key={idx} review={review} />
      ))}

      {openModal && <ReviewModal onClose={() => setOpenModal(false)} />}
    </div>
  );
};

export default ReviewList;
