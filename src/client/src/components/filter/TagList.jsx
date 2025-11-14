import icons from '../../assets/react-icons/icon'
import { DEFAULT_PRICE_RANGE, formatPriceRange } from '../../utils/index';

const { MdClose, MdStar } = icons

const Tag = ({ children, onRemove }) => (
    <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
        {children}
        <MdClose className="cursor-pointer hover:text-red-500" onClick={onRemove} />
    </span>
);


const TagList = ({ brands=[], selectedBrands, price= DEFAULT_PRICE_RANGE, rating, removeItem, clearAll }) => {

    const hasPrice = price[0] !== DEFAULT_PRICE_RANGE[0] || price[1] !== DEFAULT_PRICE_RANGE[1];

    return (
        <>
            <div className="flex justify-between mb-3">
                <h3 className="font-medium text-primary">Bạn chọn</h3>
                <button onClick={clearAll} className="text-sm hover:text-green-600">
                    Bỏ hết
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {selectedBrands.map((id) => {
                    const brand = brands.find(b => b.id === id);
                    return (
                        <Tag key={id} onRemove={() => removeItem("brand", id)}>
                            {brand?.name || id}  {/* hiển thị name, fallback ID */}
                        </Tag>
                    )
                })}

                {hasPrice && (
                    <Tag onRemove={() => removeItem("price")}>
                        {formatPriceRange(price)}₫
                    </Tag>
                )}

                {rating && (
                    <Tag onRemove={() => removeItem("rating")}>
                        {rating}
                        <span className='text-yellow-400'><MdStar/></span>
                    </Tag>
                )}
            </div>
        </>
    )
};

export default TagList;
