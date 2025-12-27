import { Outlet } from "react-router-dom";
import { AdminSidebar, AdminHeader, AdminFooter } from "../components";

const SIDEBAR_WIDTH = 256; // w-64
const HEADER_HEIGHT = 80;  // h-20

const AdminLayout = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Sidebar fixed */}
            <AdminSidebar />

            {/* Header fixed */}
            <div
                className="fixed top-0 right-0 z-40"
                style={{ left: SIDEBAR_WIDTH }}
            >
                <AdminHeader />
            </div>

            {/* Main content wrapper */}
            <div
                className="flex flex-col flex-1"
                style={{
                    marginLeft: SIDEBAR_WIDTH,
                    paddingTop: HEADER_HEIGHT,
                }}
            >
                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>

                {/* Footer at bottom */}
                <AdminFooter />
            </div>
        </div>
    );
};

export default AdminLayout;