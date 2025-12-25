// src/pages/admin/statistics/components/TopProductsChart.jsx
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const TopProductsChart = () => {
    const { topProducts } = useSelector(state => state.statistics);

    if (!topProducts || topProducts.length === 0) return <div className="bg-white rounded-2xl shadow-xl p-8 h-96 animate-pulse"><div className="bg-gray-200 rounded h-full"></div></div>;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800">Top sản phẩm bán chạy</h3>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M ₫`} />
                    <YAxis dataKey="productName" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ₫`} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]}>
                        <LabelList dataKey="revenue" position="right" formatter={(v) => `${Number(v).toLocaleString()} ₫`} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopProductsChart;