import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { getProductDetail, getProductsList } from "../../store/actions/product";
import { toSlug } from "../../utils";

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const { products, product } = useSelector(state => state.product);
    const [currentProductId, setCurrentProductId] = useState(null);

    // 1. Nếu products chưa load, gọi API danh sách sản phẩm
    useEffect(() => {
        if (products.length === 0) {
            dispatch(getProductsList());
        }
    }, [products.length, dispatch]);

    // 2. Khi products có sẵn, tìm productId từ slug
    useEffect(() => {
        if (products.length > 0 && slug) {
            const matchedProduct = products.find(p => toSlug(p.name) === slug);
            if (matchedProduct) setCurrentProductId(matchedProduct.id);
        }
    }, [products, slug]);

    // 3. Khi có productId, gọi API chi tiết
    useEffect(() => {
        if (currentProductId) {
            dispatch(getProductDetail(currentProductId));
        }
    }, [currentProductId, dispatch]);

    return (
        <div>
            <h1>{product?.name}</h1>
            <p>{product?.brand?.name}</p>
        </div>
    )
}

export default ProductDetail
