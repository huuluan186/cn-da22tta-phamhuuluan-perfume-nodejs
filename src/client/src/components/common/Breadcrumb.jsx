import { Link, useLocation } from "react-router-dom";
import { breadcrumbMap } from "../../constants/breadcrumbs";
import { path } from "../../constants/path";

const Breadcrumb = () => {
    const { pathname } = useLocation();

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

    // Luôn thêm "Trang chủ" ở đầu (trừ khi là trang chủ)
    const breadcrumbs =
        pathname === path.HOME
            ? breadcrumbMap[path.HOME]
            : [breadcrumbMap[path.HOME][0], ...customTrail];

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
