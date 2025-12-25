// src/pages/admin/statistics/components/RevenueByPaymentChart.jsx
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const RevenueByPaymentChart = () => {
    const { revenueByPayment } = useSelector(state => state.statistics);

    if (!revenueByPayment || revenueByPayment.length === 0) return <div className="bg-white rounded-2xl shadow-xl p-8 h-96 animate-pulse"><div className="bg-gray-200 rounded h-full"></div></div>;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo phương thức thanh toán</h3>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={revenueByPayment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="paymentMethod" />
                    <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M ₫`} />
                    <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ₫`} />
                    <Bar dataKey="revenue" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueByPaymentChart;