import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'];

const RevenueByCategory = () => {
    const { revenueByCategory } = useSelector(state => state.statistics);

    // if (isLoading || !data) {
    //     return (
    //         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-pulse">
    //             <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
    //             <div className="grid grid-cols-3 gap-6 mb-8">
    //                 {[1, 2, 3].map(i => (
    //                     <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
    //                 ))}
    //             </div>
    //             <div className="h-96 bg-gray-200 rounded-xl"></div>
    //         </div>
    //     );
    // }
    if (!revenueByCategory || revenueByCategory.length === 0) return <div className="bg-white rounded-2xl shadow-xl p-8 h-96 animate-pulse"><div className="bg-gray-200 rounded h-full"></div></div>;
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo danh mục</h3>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={revenueByCategory}
                            dataKey="revenue"
                            nameKey="categoryName"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label={({ revenue }) => `${(revenue / 1000000).toFixed(1)}M`}
                        >
                            {revenueByCategory?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ₫`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueByCategory;