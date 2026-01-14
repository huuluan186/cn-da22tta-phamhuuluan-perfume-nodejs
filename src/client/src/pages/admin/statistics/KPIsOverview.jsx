// src/pages/admin/statistics/components/KPIsOverview.jsx
import { useSelector } from "react-redux";

const KPIsOverview = () => {
    const { kpis } = useSelector(state => state.statistics);
    const { resultCount } = useSelector(state => state.product);
    const { users } = useSelector(state => state.user);

    const totalProducts = resultCount || 0;
    const totalUsers = users?.total || 0;

    if (!kpis) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const kpiList = [
        {
            label: "Tổng doanh thu",
            value: `${Number(kpis?.totalRevenue || 0).toLocaleString()} ₫`,
            color: "from-blue-500 to-blue-600",
        },
        {
            label: "Đơn đã duyệt",
            value: Number(kpis?.approvedOrders || 0).toLocaleString(),
            color: "from-green-500 to-green-600",
        },
        {
            label: "Đơn chưa duyệt",
            value: Number(kpis?.pendingOrders || 0).toLocaleString(),
            color: "from-yellow-500 to-yellow-600",
        },
        {
            label: "AOV trung bình",
            value: `${Number(kpis?.avgOrderValue || 0).toLocaleString()} ₫`,
            color: "from-purple-500 to-purple-600",
        },
        {
            label: "Sản phẩm bán ra",
            value: Number(kpis?.totalProductsSold || 0).toLocaleString(),
            color: "from-orange-500 to-orange-600",
        },
        {
            label: "Tổng khách hàng",
            value: totalUsers.toLocaleString(),
            color: "from-indigo-500 to-indigo-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiList.map((item, index) => (
                <KPIBox key={index} item={item} />
            ))}
        </div>
    );
};

const KPIBox = ({ item }) => (
    <div
        className={`bg-gradient-to-br ${item.color} text-white rounded-lg shadow-md p-4 transition hover:scale-105`}
    >
        <h3 className="text-sm font-medium opacity-90 mb-2">
            {item.label}
        </h3>
        <p className="text-2xl font-bold">
            {item.value}
        </p>
    </div>
);

export default KPIsOverview;
