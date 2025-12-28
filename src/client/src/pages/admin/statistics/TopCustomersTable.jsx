// src/pages/admin/statistics/components/TopCustomersTable.jsx
import { useSelector } from "react-redux";

const TopCustomersTable = () => {
    const { topCustomers } = useSelector(state => state.statistics);

    if (!topCustomers || topCustomers.length === 0) return <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse"><div className="bg-gray-200 rounded h-64"></div></div>;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Top 5 khách hàng VIP</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="py-3">Tên khách</th>
                            <th className="py-3">Email</th>
                            <th className="py-3">Số đơn</th>
                            <th className="py-3">Tổng chi tiêu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topCustomers.map((c, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="py-4">{c.name || 'Khách lẻ'}</td>
                                <td className="py-4">{c.email}</td>
                                <td className="py-4">{c.orderCount}</td>
                                <td className="py-4 font-semibold">{c.totalSpent.toLocaleString()} ₫</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopCustomersTable;