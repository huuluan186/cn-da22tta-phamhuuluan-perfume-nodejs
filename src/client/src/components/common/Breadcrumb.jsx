import { Link, useLocation } from "react-router-dom";
import { breadcrumbMap } from "../../constants/breadcrumbs";
import { path } from "../../constants/path";

const Breadcrumb = () => {
    const { pathname } = useLocation();

    // Hàm ánh xạ pathname với key trong breadcrumbMap
    const getBreadcrumbKey = () => {
        // Kiểm tra tuyến tĩnh
        if (breadcrumbMap[pathname]) {
            return pathname;
        }

        // Xử lý các tuyến động
        const dynamicRoutes = Object.keys(breadcrumbMap).filter((key) =>
            key.includes(":")
        );

        for (const route of dynamicRoutes) {
            // Chuyển đổi route thành regex (thay :param bằng [^/]+)
            const pattern = `^${route.replace(/:[^/]+/g, "[^/]+")}$`;
            const regex = new RegExp(pattern);
            if (regex.test(pathname)) {
                return route;
            }
        }

        // Trả về null nếu không khớp
        return null;
    };

    // Lấy breadcrumb riêng cho path hiện tại
    const customTrail = getBreadcrumbKey() ? breadcrumbMap[getBreadcrumbKey()] || [] : [];

    // Luôn thêm "Trang chủ" ở đầu (trừ khi là trang chủ)
    const breadcrumbs =
        pathname === path.HOME
            ? breadcrumbMap[path.HOME]
            : [breadcrumbMap[path.HOME][0], ...customTrail];

    return (
        <nav className="text-sm text-gray-600 my-2">
            <ol className="list-reset flex">
                {breadcrumbs.map((label, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    const link = index === 0 ? path.HOME : undefined;

                    const baseClass = index === 0 ? "text-gray-500" : "text-primary";
                    const linkClass = `${baseClass} hover:underline`;

                    return (
                        <li key={index} className="flex items-center">
                            {index !== 0 && <span className="mx-2">{">"}</span>}
                            {isLast ? (
                                <span className={baseClass}>
                                    {label}
                                </span>
                            ) : (
                                <Link to={link} className={linkClass}>
                                    {label}
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
