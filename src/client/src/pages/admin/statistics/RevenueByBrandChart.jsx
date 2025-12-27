// src/pages/admin/statistics/components/RevenueByBrandChart.jsx
import { useSelector } from "react-redux";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import icons from "../../../assets/react-icons/icon";

const { MdZoomIn, MdClose } = icons;

const COLORS = ['#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899', '#6366f1'];

const RevenueByBrandChart = () => {
    const { revenueByBrand } = useSelector(state => state.statistics);
    const [isZoomed, setIsZoomed] = useState(false);

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

    const ChartContent = ({ height = 500, outerRadius = 100 }) => (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={dataWithPercent}
                    dataKey="revenue"
                    nameKey="brandName"
                    cx="50%"
                    cy="42%"
                    outerRadius={outerRadius}
                    innerRadius={outerRadius * 0.46} // donut style nhẹ, đẹp hơn
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
                    height={80}
                    wrapperStyle={{
                        maxHeight: 80,
                        overflowY: 'auto',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        fontSize: '13px'
                    }}
                    className="scrollbar-hide"
                    formatter={(value, entry) => {
                        const { revenue, percent } = entry.payload;
                        return `${value}: ${Number(revenue).toLocaleString()} ₫ (${percent}%)`;
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo thương hiệu</h3>
                    <button
                        onClick={() => setIsZoomed(true)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition"
                        title="Phóng to"
                    >
                        <MdZoomIn size={20} className="text-blue-600" />
                    </button>
                </div>
                <ChartContent />
            </div>

            {/* Modal phóng to */}
            {isZoomed && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo thương hiệu</h3>
                            <button
                                onClick={() => setIsZoomed(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>
                        <div className="flex-1 p-6 min-h-0">
                            <ChartContent height="100%" outerRadius={160} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RevenueByBrandChart;