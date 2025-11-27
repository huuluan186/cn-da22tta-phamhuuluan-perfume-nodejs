import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsList } from "../../store/actions/product";
import { ProductCard, Button, Pagination } from "../../components";
import { useParams, useOutletContext, useLocation  } from "react-router-dom";
import { SORT_OPTIONS } from "../../constants/sortKeys";
import { ITEMS_PER_PAGE } from "../../constants/pagination";
import icons from '../../assets/react-icons/icon'
import {capitalizeWords, buildProductParams} from '../../utils/index'
import { path } from "../../constants/path";
import { useSyncFiltersWithURL } from "../../hooks/useSyncFiltersWithURL";

const { IoList, BsFillGrid3X2GapFill } = icons

const ProductList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchKeyword = searchParams.get("query") || "";
    const { slug } = useParams();
    const { products, error, resultCount } = useSelector(state => state.product);
    const { categories } = useSelector(state => state.category)
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
    const { filters, setFilters } = useOutletContext();
    const productListRef = useRef(null);
    // Sync filters: page, sort, keyword, view
    //useSyncFiltersWithURL(filters, setFilters, ["page", "sort", "keyword", "view"]);

    // Cập nhật categoryId khi slug thay đổi
    useEffect(() => {
        if (categories?.length && slug) {
            const category = categories.find(c => c.slug === slug);
            setFilters(prev => ({ ...prev, categoryId: category?.id, page: 1 }));
        } else {
            setFilters(prev => ({ ...prev, categoryId: undefined, page: 1 }));
        }
    }, [categories, slug, setFilters]);

    // Gọi API mỗi khi filters thay đổi
    useEffect(() => {
        dispatch(getProductsList(buildProductParams(filters)));
    }, [
        dispatch,
        filters.categoryId,
        filters.selectedBrands,
        filters.price,
        filters.rating,
        filters.keyword,
        filters.sort,
        filters.page,
    ]);

    useEffect(() => {
        if (searchKeyword) {
            setFilters(prev => ({ ...prev, keyword: searchKeyword, page: 1 }));
        } else {
            setFilters(prev => ({...prev, keyword: '', page: 1 }))
        }
    }, [searchKeyword])

    const { pathname } = location;
    const pageTitle =
    pathname === path.SEARCH
        ? "Sản phẩm tìm kiếm phù hợp"
        : slug
            ? categories?.find(c => c.slug === slug)?.name || ""
            : "Tất cả sản phẩm";


    // Phân trang client-side
    const currentPage = filters.page || 1;
    const totalItems = resultCount || products?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <div className="space-y-4 mx-1 my-2">
            <h2 className="text-3xl font-semibold text-gray-800">{capitalizeWords(pageTitle)}</h2>
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    {!error && (
                        <><strong className="text-green-600">{resultCount}</strong> kết quả</>
                    )}
                </p>
                <div className="flex items-center gap-1 text-sm">
                    <label className="text-gray-700">Sắp xếp theo:</label>
                    <select
                        value={filters.sort}
                        className={`outline-slate-600 px-2 rounded text-sm ${"font-semibold"}`}
                        onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                    >
                        {SORT_OPTIONS.map(option => (
                            <option key={option.key} value={option.value} >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-gray-700">Xem:</span>
                <Button
                    text="Lưới"
                    textColor={`font-normal ${viewMode === "grid" ? "text-primary" : "text-gray-400"}`}
                    outline='border'
                    bgColor="bg-white"
                    IcBefore={BsFillGrid3X2GapFill}
                    width="w-20"
                    height="h-[30px]"
                    className="font-normal"
                    onClick={() => setViewMode("grid")}
                />
                <Button
                    text="Cột"
                    textColor={`font-normal ${viewMode === "list" ? " text-primary" : "text-gray-400"}`}
                    outline='border'
                    bgColor="bg-white"
                    IcBefore={IoList}
                    width="w-20"
                    height="h-[30px]"
                    onClick={() => setViewMode("list")}
                />
            </div>

            {/* Hiển thị lỗi hoặc không có sản phẩm */}
            {error || products?.length === 0 
                ? 
                (
                    <div className="text-orange-800 bg-[#FCF8E3] p-3 rounded">
                        Không có sản phẩm nào trong danh mục này.
                    </div>
                ) 
                : null
            }

            <div 
                ref={productListRef}
                className={
                    viewMode==='grid'
                        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6"
                        : "flex flex-col gap-4"
                }
            >
                {!error && products?.length > 0 && (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} viewMode={viewMode}/>
                    ))
                )}
            </div>

            <div className="pt-12 pb-6">
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                    scrollRef={productListRef}
                />
            </div>
        </div>
    )
}

export default ProductList
