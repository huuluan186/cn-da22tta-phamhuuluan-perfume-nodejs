import { Link, useLocation, useParams } from "react-router-dom";
import { breadcrumbMap } from "../../constants/breadcrumbs";
import { path } from "../../constants/path";
import { useSelector } from "react-redux";

const Breadcrumb = () => {
    const { pathname } = useLocation();
    const { slug } = useParams();
    const { categories } = useSelector(state => state.category);
    const { product } = useSelector(state => state.product);
    const { brandDetail } = useSelector(state => state.brand);

     // Tìm key khớp trong breadcrumbMap (có hỗ trợ route động)
    const findBreadcrumbKey = () => {
        if (breadcrumbMap[pathname]) return pathname;

        for (const route in breadcrumbMap) {
            if (route.includes(":")) {
                const regex = new RegExp(`^${route.replace(/:[^/]+/g, "[^/]+")}$`);
                if (regex.test(pathname)) return route;
            }
        }
        return null;
    };

    const matchedKey = findBreadcrumbKey(); 

    // Lấy breadcrumb riêng cho path hiện tại 
    const customTrail = matchedKey ? breadcrumbMap[matchedKey] || [] : []; 

    let dynamicTrail = customTrail;

    // Nếu là trang product detail và product đã load 
    if (matchedKey === path.PRODUCT_DETAIL && product) {
        dynamicTrail = [{ label: product.name }];
    }
    else if (matchedKey === path.BRAND_DETAIL && brandDetail) {
        dynamicTrail = [{ label: brandDetail.name }];
    }
    // Nếu là category slug 
    else if (slug) { 
        const currentCategory = categories.find(c => c.slug === slug); 
        let categoryLabel = currentCategory ? currentCategory.name : slug.replace(/-/g, " "); categoryLabel += " chính hãng"; 
        dynamicTrail = customTrail.map(item => 
            item.label === "Danh mục" ? { label: categoryLabel } : item 
        ); 
    }

    // Luôn thêm "Trang chủ" ở đầu (trừ khi là trang chủ)
    const breadcrumbs =
        pathname === path.HOME
            ? breadcrumbMap[path.HOME]
            : [breadcrumbMap[path.HOME][0], ...dynamicTrail];

    return (
        <nav className="text-sm text-gray-600 my-2">
            <ol className="list-reset flex">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                        <li key={index} className="flex items-center">
                            {index !== 0 && <span className="mx-2">{">"}</span>}
                            {isLast ? (
                                <span className='text-primary font-medium'>
                                    {item.label}
                                </span>
                            ) : (
                                <Link to={item.link} className='text-gray-600 hover:text-primary hover:underline'>
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
