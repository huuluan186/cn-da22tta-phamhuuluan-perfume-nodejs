import { Outlet } from "react-router-dom";

const StatisticLayout = () => {
    return (
        <div className="bg-gray-50 rounded-lg shadow p-5">
            <h2 className="text-2xl font-bold text-primary text-center mb-3">
                📊 THỐNG KÊ VÀ BÁO CÁO
            </h2>
            <Outlet />
        </div>
    );
};

export default StatisticLayout;
