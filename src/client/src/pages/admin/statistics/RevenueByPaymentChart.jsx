// src/pages/admin/statistics/components/RevenueByPaymentChart.jsx
import { useSelector } from "react-redux";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import icons from "../../../assets/react-icons/icon";

const { MdZoomIn, MdClose } = icons;

const RevenueByPaymentChart = () => {
    const { revenueByPayment } = useSelector(state => state.statistics);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!revenueByPayment || revenueByPayment.length === 0) return <div className="bg-white rounded-2xl shadow-xl p-8 h-96 animate-pulse"><div className="bg-gray-200 rounded h-full"></div></div>;

    const ChartContent = ({ height = 500 }) => (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={revenueByPayment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="paymentMethod" />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M ₫`} />
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ₫`} />
                <Bar dataKey="revenue" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo phương thức thanh toán</h3>
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
                            <h3 className="text-2xl font-bold text-gray-800">Doanh thu theo phương thức thanh toán</h3>
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

export default RevenueByPaymentChart;