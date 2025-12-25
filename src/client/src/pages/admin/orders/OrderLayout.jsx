import { Outlet } from "react-router-dom";

const OrderLayout = () => {
    return (
        <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-2xl text-center font-bold text-primary mb-4">
                QUẢN LÝ ĐƠN HÀNG
            </h2>

            <Outlet />
        </div>
    );
};

export default OrderLayout;
