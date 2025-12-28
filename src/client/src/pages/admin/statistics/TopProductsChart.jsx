// src/pages/admin/statistics/components/TopProductsChart.jsx
import { useSelector } from "react-redux";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import icons from "../../../assets/react-icons/icon";

const { MdZoomIn, MdClose } = icons;

const TopProductsChart = () => {
    const { topProducts } = useSelector(state => state.statistics);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!topProducts || topProducts.length === 0) return <div className="bg-white rounded-2xl shadow-xl p-8 h-96 animate-pulse"><div className="bg-gray-200 rounded h-full"></div></div>;

    const ChartContent = ({ height = 500 }) => (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 5, right: 120, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <YAxis dataKey="productName" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ₫`} />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]}>
                    <LabelList dataKey="revenue" position="right" formatter={(v) => `${Number(v).toLocaleString()} ₫`} style={{ fontSize: 12 }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Top sản phẩm bán chạy</h3>
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
                            <h3 className="text-2xl font-bold text-gray-800">Top sản phẩm bán chạy</h3>
                            <button
                                onClick={() => setIsZoomed(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>
                        <div className="flex-1 p-6 min-h-0">
                            <ChartContent height="100%" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TopProductsChart;