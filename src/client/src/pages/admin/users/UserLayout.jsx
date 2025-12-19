import { Outlet } from "react-router-dom";

const UserLayout = () => {
    return (
        <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-bold text-primary mb-4">
                Quản lý người dùng
            </h2>

            <Outlet />
        </div>
    );
};

export default UserLayout;
