// src/pages/admin/statistics/components/RevenueTrendChart.jsx
import { useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const RevenueTrendChart = () => {
    const { revenueTrend } = useSelector(state => state.statistics);

    if (!revenueTrend || revenueTrend.length === 0) return <div className="bg-white rounded-2xl shadow-xl p-8 h-96 animate-pulse"><div className="bg-gray-200 rounded h-full"></div></div>;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Xu hướng doanh thu</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M ₫`} />
                    <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ₫`} />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueTrendChart;