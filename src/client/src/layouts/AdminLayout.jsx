import { Outlet } from "react-router-dom";
import { AdminSidebar, AdminHeader } from "../components";

const SIDEBAR_WIDTH = 256; // w-64
const HEADER_HEIGHT = 80;  // h-20

const AdminLayout = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Sidebar fixed */}
            <AdminSidebar />

            {/* Header fixed */}
            <div
                className="fixed top-0 right-0 z-40"
                style={{ left: SIDEBAR_WIDTH }}
            >
                <AdminHeader />
            </div>

            {/* Main content */}
            <main
                className="p-6 overflow-y-auto"
                style={{
                    marginLeft: SIDEBAR_WIDTH,
                    paddingTop: HEADER_HEIGHT,
                    height: "100vh"
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;