import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsList } from "../../store/actions/product";
import { ProductCard, Button } from "../../components";
import { useParams, useOutletContext } from "react-router-dom";
import { SORT_OPTIONS } from "../../constants/sortKeys";
import icons from '../../assets/react-icons/icon'
import {capitalizeWords, buildProductParams} from '../../utils/index'

const { IoList, BsFillGrid3X2GapFill } = icons

const ProductList = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const { products, error, resultCount } = useSelector(state => state.product);
    const { categories } = useSelector(state => state.category)
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
    const { filters, setFilters } = useOutletContext();

    // Cập nhật categoryId khi slug thay đổi
    useEffect(() => {
        if (categories?.length && slug) {
            const category = categories.find(c => c.slug === slug);
            setFilters(prev => ({
                ...prev,
                categoryId: category?.id
            }));
        } else {
            setFilters(prev => ({ ...prev, categoryId: undefined }));
        }
    }, [categories, slug]);

    // Gọi API mỗi khi filters thay đổi
    useEffect(()  => {
        const fetchProducts = async () => {
            dispatch(getProductsList(buildProductParams(filters)));
        };
        fetchProducts();
    }, [
        dispatch,
        filters.categoryId,
        filters.selectedBrands,
        filters.price,
        filters.rating,
        filters.keyword,
        filters.sort
    ]);

    const category = categories?.find(c => c.slug === slug);
    const pageTitle = slug ? category?.name || "" : "Tất cả sản phẩm";

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
            {error || products?.length === 0 ? (
                <div className="text-orange-800 bg-[#FCF8E3] p-3 rounded">
                    Không có sản phẩm nào trong danh mục này.
                </div>
            ) : null}
            <div 
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
        </div>
    )
}

export default ProductList
