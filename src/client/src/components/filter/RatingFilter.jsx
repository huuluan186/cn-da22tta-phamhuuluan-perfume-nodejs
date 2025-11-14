import { useState } from "react";
import icons from '../../assets/react-icons/icon'

const {MdKeyboardArrowUp, MdKeyboardArrowDown, MdStar} = icons

const RatingFilter = ({ rating, filters, setFilters }) => {
    const [open, setOpen] = useState(false);

    return (
        <section>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between font-medium mb-2"
            >
                Đánh giá
                {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </button>

            {open && (
                <div className="space-y-0.5">
                    {[5, 4, 3, 2, 1].map((s) => (
                        <label
                            key={s}
                            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="rating"
                                checked={rating === s}
                                onChange={() =>
                                    setFilters({ ...filters, rating: rating === s ? null : s })
                                }
                            />
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <MdStar
                                        key={i}
                                        size={18}
                                        className={i < s ? "text-yellow-400" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                        </label>
                    ))}
                </div>
            )}
        </section>
    );
};

export default RatingFilter;
