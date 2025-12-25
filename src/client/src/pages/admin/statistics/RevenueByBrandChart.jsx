// src/pages/admin/statistics/components/RevenueByBrandChart.jsx
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899', '#6366f1'];

const RevenueByBrandChart = () => {
    const { revenueByBrand } = useSelector(state => state.statistics);

    // Loading skeleton
    if (!revenueByBrand) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 h-96 animate-pulse">
                <div className="bg-gray-200 rounded h-full"></div>
            </div>
        );
    }

    // Tính tổng doanh thu
    const totalRevenue = revenueByBrand.reduce((sum, item) => sum + Number(item.revenue), 0);

    // Chuẩn bị data với phần trăm
    const dataWithPercent = revenueByBrand.map(item => ({
        ...item,
        percent: totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : 0
    }));

    // Custom label trên pie (hiển thị % trực tiếp)
    const renderCustomLabel = ({ percent }) => `${percent}%`;

    // Custom tooltip (hiển thị tên + tiền + %)
    const customTooltip = ({ active, payload }) => {
        if (active && payload && payload[0]) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-semibold">{data.brandName || 'Khác'}</p>
                    <p className="text-sm">Doanh thu: {Number(data.revenue).toLocaleString()} ₫</p>
                    <p className="text-sm font-medium">Chiếm: {data.percent}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo thương hiệu</h3>
            <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                    <Pie
                        data={dataWithPercent}
                        dataKey="revenue"
                        nameKey="brandName"
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        innerRadius={60} // donut style nhẹ, đẹp hơn
                        label={renderCustomLabel}
                        labelLine={false} // tắt đường nối mũi tên
                    >
                        {dataWithPercent.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={customTooltip} />
                    <Legend
                        verticalAlign="bottom"
                        height={100} // tăng để đủ chỗ scroll nếu cần
                        wrapperStyle={{
                            maxHeight: 100,      // giới hạn chiều cao box legend
                            overflowY: 'auto',  // cho phép scroll nội dung tràn
                            msOverflowStyle: 'none', // ẩn scrollbar IE/Edge
                            scrollbarWidth: 'none'   // ẩn scrollbar Firefox
                        }}
                        className="scrollbar-hide"
                        formatter={(value, entry) => {
                            const { revenue, percent } = entry.payload;
                            return `${value}: ${Number(revenue).toLocaleString()} ₫ (${percent}%)`;
                        }}
                    />

                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueByBrandChart;