import { useState } from "react";
import { Range } from "react-range";
import icons from '../../assets/react-icons/icon'
import { DEFAULT_PRICE_RANGE, MAX_PRICE, MIN_PRICE, PRICE_STEP, formatPriceRange } from '../../utils/index';

const {MdKeyboardArrowUp, MdKeyboardArrowDown} = icons

const PriceFilter = ({ price = DEFAULT_PRICE_RANGE, filters, setFilters }) => {
    const [open, setOpen] = useState(false);

    return (
        <section>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between font-medium mb-2"
            >
                Khoảng giá
                {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </button>

            {open && (
                <div className="px-2 py-2">
                    <Range
                        step={PRICE_STEP}
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        values={price}
                        onChange={(val) => setFilters({ ...filters, price: val })}
                        renderTrack={({ props, children }) => {
                            const [minVal, maxVal] = price;
                            const minPercent = (minVal / 20000000) * 100;
                            const maxPercent = (maxVal / 20000000) * 100;

                            return (
                                <div
                                    {...props}
                                    className="relative w-full h-1.5 rounded-full bg-gray-300"
                                >
                                    <div
                                        className="absolute h-1.5 bg-green-500 rounded-full"
                                        style={{
                                            left: `${minPercent}%`,
                                            right: `${100 - maxPercent}%`,
                                        }}
                                    />
                                    {children}
                                </div>
                            );
                        }}

                        renderThumb={({ props }) => (
                            <div
                                {...props}
                                className="w-4 h-4 bg-white border-2 border-green-500 rounded-full shadow-md hover:shadow-lg"
                            />
                        )}
                    />

                    <div className="flex justify-between mt-4 text-sm">
                        <span>{formatPriceRange([price[0], price[1]]).split(' - ')[0]}₫</span>
                        <span>{formatPriceRange([price[0], price[1]]).split(' - ')[1]}₫</span>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PriceFilter;
