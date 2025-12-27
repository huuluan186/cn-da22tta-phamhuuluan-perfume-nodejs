import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { adminSidebarItems } from "../../constants/adminSidebarItems";
import logo from "../../assets/images/Perfumora_Logo_Artistic_3-removebg-preview.png";
import { path } from "../../constants/path";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <aside className="fixed top-0 left-0 h-screenw-64 bg-gradient-to-b from-primary to-green-700 text-white shadow-lg z-50 flex flex-col">
            {/* Logo */}
            <div className="h-20 flex items-center justify-center border-b border-white/20 px-4">
                <img
                    src={logo}
                    alt="Perfumora"
                    className="h-14 object-contain drop-shadow-md"
                />
            </div>

            {/* Menu */}
            <nav className="py-3">
                {adminSidebarItems.map((item, index) => {
                    const basePath = path.ADMIN;
                    const fullPath = `${basePath}/${item.to}`;
                    const isActive =
                        pathname === fullPath ||
                        pathname.startsWith(fullPath + "/");

                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.to)}
                            className={clsx(
                                "group relative w-full flex items-center gap-3 px-5 py-3 text-left rounded-md overflow-hidden transition-all duration-300",
                                isActive
                                    ? "bg-white text-primary font-semibold shadow-lg"
                                    : "hover:bg-white/20"
                            )}
                        >
                            {/* Hover gradient overlay (NỔI HƠN) */}
                            {!isActive && (
                                <span className="absolute inset-0 bg-gradient-to-r from-orange-400/30 via-orange-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}

                            {/* Active indicator */}
                            {isActive && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-orange-500 rounded-r-md" />
                            )}

                            {/* Icon */}
                            <span
                                className={clsx(
                                    "relative z-10 text-lg transition-all duration-300",
                                    isActive
                                        ? "text-primary scale-110"
                                        : "text-white group-hover:text-orange-200 group-hover:scale-125"
                                )}
                            >
                                {item.icon}
                            </span>

                            {/* Label */}
                            <span
                                className={clsx(
                                    "relative z-10 transition-all duration-300",
                                    isActive
                                        ? "text-primary"
                                        : "group-hover:text-orange-100"
                                )}
                            >
                                {item.label}
                            </span>
                        </button>

                    );
                })}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
