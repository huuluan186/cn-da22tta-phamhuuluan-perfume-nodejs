import { Outlet } from "react-router-dom";

const ReviewLayout = () => {
    return (
        <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-2xl text-center font-bold text-primary mb-4">
                QUẢN LÝ ĐÁNH GIÁ
            </h2>

            <Outlet />
        </div>
    );
};

export default ReviewLayout;
