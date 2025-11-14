import { BrandFilter, PriceFilter, RatingFilter, TagList } from "../index";
import { DEFAULT_PRICE_RANGE } from '../../utils/index'

const FiltersSidebar = ({
    brands = [],
    filters,
    setFilters,
}) => {
    const { selectedBrands, price, rating } = filters;;

    const clearAll = () => {
        setFilters({
            selectedBrands: [],
            price: DEFAULT_PRICE_RANGE,
            rating: null,
        });
    };

    const removeItem = (type, value) => {
        if (type === "brand") {
            setFilters({
                ...filters,
                selectedBrands: selectedBrands.filter((b) => b !== value),
            });
        }
        else if (type === "price") {
            setFilters({ ...filters, price: DEFAULT_PRICE_RANGE});
        }
        else if (type === "rating") {
            setFilters({ ...filters, rating: null });
        }
    };

    const hasSelected =
        selectedBrands.length ||
        price[0] !== DEFAULT_PRICE_RANGE[0] ||
        price[1] !== DEFAULT_PRICE_RANGE[1] ||
        rating !== null;

    return (
        <div className="bg-white border shadow-sm px-4 py-2">
            <div className="text-gray-800">
                <h2 className="text-lg font-semibold">BỘ LỌC</h2>
                <p className="text-sm">Giúp lọc nhanh sản phẩm bạn tìm kiếm</p>
            </div>

            <hr className="border-gray-300 my-4" />

            {/* Tag Selected */}
            {hasSelected && (
                <>
                    <TagList
                        brands={brands}
                        selectedBrands={selectedBrands}
                        price={price}
                        rating={rating}
                        removeItem={removeItem}
                        clearAll={clearAll}
                    />
                    <hr className="border-gray-300 my-4" />
                </>
            )}

            {/* Filters */}
            <BrandFilter
                brands={brands}
                selected={selectedBrands}
                setFilters={setFilters}
                filters={filters}
            />
            <hr className="border-gray-300 my-4" />
            <PriceFilter
                price={price}
                setFilters={setFilters}
                filters={filters}
            />
            <hr className="border-gray-300 my-4" />
            <RatingFilter
                rating={rating}
                setFilters={setFilters}
                filters={filters}
            />
        </div>
    );
};

export default FiltersSidebar;
