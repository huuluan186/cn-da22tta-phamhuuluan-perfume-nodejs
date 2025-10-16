import { Link, useLocation } from "react-router-dom";
import { breadcrumbMap } from "../../constants/breadcrumbs";
import { path } from "../../constants/path";

const Breadcrumb = () => {
  const { pathname } = useLocation();

  // Lấy breadcrumb riêng cho path hiện tại
  const customTrail = breadcrumbMap[pathname] || [];

  // Luôn thêm "Trang chủ" ở đầu
  const breadcrumbs = [breadcrumbMap[path.HOME], ...customTrail];

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
