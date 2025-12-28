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
            label: "Tổng đơn hàng",
            value: Number(kpis?.totalOrders || 0).toLocaleString(),
            color: "from-green-500 to-green-600",
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
        <div className="space-y-6">
            {/* HÀNG 1 – 3 BOX */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {kpiList.slice(0, 3).map((item, index) => (
                    <KPIBox key={index} item={item} />
                ))}
            </div>

            {/* HÀNG 2 – 2 BOX CĂN GIỮA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {kpiList.slice(3).map((item, index) => (
                    <KPIBox key={index} item={item} />
                ))}
            </div>
        </div>
    );
};

const KPIBox = ({ item }) => (
    <div
        className={`bg-gradient-to-br ${item.color} text-white rounded-xl shadow-lg p-5 transition hover:scale-105`}
    >
        {/* KHÔNG truncate để hiện full chữ */}
        <h3 className="text-sm font-medium opacity-90 whitespace-normal">
            {item.label}
        </h3>
        <p className="text-2xl font-bold mt-2 whitespace-normal">
            {item.value}
        </p>
    </div>
);

export default KPIsOverview;
