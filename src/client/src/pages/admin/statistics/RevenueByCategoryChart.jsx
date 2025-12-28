import { useSelector } from "react-redux";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import icons from "../../../assets/react-icons/icon";

const { MdZoomIn, MdClose } = icons;

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'];

const RevenueByCategory = () => {
    const { revenueByCategory } = useSelector(state => state.statistics);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!revenueByCategory || revenueByCategory.length === 0) return <div className="bg-white rounded-2xl shadow-xl p-8 h-96 animate-pulse"><div className="bg-gray-200 rounded h-full"></div></div>;


    const ChartContent = ({ height = 384, outerRadius = 95 }) => (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={revenueByCategory}
                    dataKey="revenue"
                    nameKey="categoryName"
                    cx="50%"
                    cy="42%"
                    outerRadius={outerRadius}
                    label={({ revenue }) => `${(revenue / 1000000).toFixed(1)}M`}
                >
                    {revenueByCategory?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ₫`} />
                <Legend
                    wrapperStyle={{ fontSize: '13px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo danh mục</h3>
                    <button
                        onClick={() => setIsZoomed(true)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition"
                        title="Phóng to"
                    >
                        <MdZoomIn size={20} className="text-blue-600" />
                    </button>
                </div>
                <div className="h-96">
                    <ChartContent />
                </div>
            </div>

            {/* Modal phóng to */}
            {isZoomed && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo danh mục</h3>
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

export default RevenueByCategory;