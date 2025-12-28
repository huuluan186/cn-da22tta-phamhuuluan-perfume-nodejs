// src/pages/admin/statistics/StatisticDashboard.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getKPIs,
    getRevenueTrend,
    getTopProducts,
    getRevenueByCategory,
    getRevenueByBrand,
    getRevenueByPayment,
    getTopCustomers
} from "../../../store/actions/statistic";
import { getProductsList } from "../../../store/actions/product";
import { getAllUsers } from "../../../store/actions/user";

import {
    KPIsOverview,
    RevenueTrendChart,
    TopProductsChart,
    RevenueByCategoryChart,
    RevenueByBrandChart,
    RevenueByPaymentChart,
    TopCustomersTable
} from '../../index';

const StatisticDashboard = () => {
    const dispatch = useDispatch();
    const statistics = useSelector(state => state.statistics);
    const productState = useSelector(state => state.product);
    const userState = useSelector(state => state.user);

    const totalProducts = productState.adminProductList?.total || productState.products?.length || 0;
    const totalUsers = userState.users?.length || 0;

    const presets = [
        { value: "today", label: "Hôm nay" },
        { value: "7days", label: "7 ngày qua" },
        { value: "30days", label: "30 ngày qua" },
        { value: "thisMonth", label: "Tháng này" },
        { value: "thisYear", label: "Năm nay" },
    ];

    const [selectedPreset, setSelectedPreset] = useState("30days");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [groupBy, setGroupBy] = useState("day");
    const [isLoading, setIsLoading] = useState(true);

    // Tính date range đúng chuẩn
    const getDateRange = () => {
        const today = new Date();

        let startDate = null;
        let endDate = null;

        if (selectedPreset === "today") {
            // Hôm nay: chỉ 1 ngày, backend sẽ xử lý đến giờ hiện tại
            startDate = today.toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0]; // cùng ngày
        } else if (selectedPreset === "7days") {
            const start = new Date(today);
            start.setDate(today.getDate() - 6);
            startDate = start.toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
        } else if (selectedPreset === "30days") {
            const start = new Date(today);
            start.setDate(today.getDate() - 29);
            startDate = start.toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
        } else if (selectedPreset === "thisMonth") {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
        } else if (selectedPreset === "thisYear") {
            startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
        } else if (selectedPreset === "custom") {
            startDate = customStart || undefined;
            endDate = customEnd || undefined;
        }

        return { startDate, endDate };
    };

    const applyFilters = () => {
        setIsLoading(true);

        const { startDate, endDate } = getDateRange();

        const params = {
            startDate,
            endDate,
            groupBy: groupBy === "total" ? undefined : groupBy
        };

        dispatch(getKPIs(params));
        dispatch(getRevenueTrend(params));
        dispatch(getTopProducts(params));
        dispatch(getRevenueByCategory(params));
        dispatch(getRevenueByBrand(params));
        dispatch(getRevenueByPayment(params));
        dispatch(getTopCustomers({ ...params, limit: 5 }));
        dispatch(getProductsList({ limit: 1 }));
        dispatch(getAllUsers());

        setTimeout(() => setIsLoading(false), 600);
    };

    // Khi chọn preset → reset custom date và áp dụng ngay
    const handlePresetClick = (value) => {
        setSelectedPreset(value);
        setCustomStart("");
        setCustomEnd("");
        // Không cần setIsCustom(false) nữa vì preset không phải custom
    };

    // Khi chọn tùy chỉnh → reset preset
    const handleCustomClick = () => {
        setSelectedPreset("custom");
        setCustomStart("");
        setCustomEnd("");
    };

    // Áp dụng khi thay đổi preset hoặc groupBy
    useEffect(() => {
        if (selectedPreset !== "custom") {
            applyFilters();
        }
    }, [selectedPreset, groupBy]);

    // Áp dụng khi bấm nút trong custom
    const handleCustomApply = () => {
        if (customStart && customEnd) {
            applyFilters();
        }
    };

    const hasData = statistics.kpis && (statistics.kpis.totalRevenue > 0 || statistics.kpis.totalOrders > 0);

    return (
        <div className="space-y-12 min-h-screen">
            {/* Bộ lọc */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Bộ lọc thống kê</h3>

                <div className="flex flex-wrap gap-4 mb-8">
                    {presets.map(p => (
                        <button
                            key={p.value}
                            onClick={() => handlePresetClick(p.value)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-md ${selectedPreset === p.value && selectedPreset !== "custom"
                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                                : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                    <button
                        onClick={handleCustomClick}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-md ${selectedPreset === "custom"
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                            : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300'
                            }`}
                    >
                        Tùy chỉnh
                    </button>
                </div>

                {selectedPreset === "custom" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                            <input
                                type="date"
                                value={customStart}
                                onChange={e => setCustomStart(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                            <input
                                type="date"
                                value={customEnd}
                                onChange={e => setCustomEnd(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleCustomApply}
                                disabled={!customStart || !customEnd}
                                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md"
                            >
                                Áp dụng lọc
                            </button>
                        </div>
                    </div>
                )}

                <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm dữ liệu theo</label>
                    <select
                        value={groupBy}
                        onChange={e => setGroupBy(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="day">Ngày</option>
                        <option value="week">Tuần</option>
                        <option value="month">Tháng</option>
                        <option value="total">Tổng quan</option>
                    </select>
                </div>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="space-y-12">
                    {/* Skeleton như trước */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
                        ))}
                    </div>
                    {/* ... các skeleton khác */}
                </div>
            ) : hasData ? (
                <>
                    <KPIsOverview totalProducts={totalProducts} totalUsers={totalUsers} />
                    <RevenueTrendChart />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <TopProductsChart />
                        <RevenueByCategoryChart />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <RevenueByBrandChart />
                        <RevenueByPaymentChart />
                    </div>
                    <TopCustomersTable />
                </>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <p className="text-xl font-medium text-gray-600">Không có dữ liệu trong khoảng thời gian này</p>
                    <p className="text-sm text-gray-500 mt-2">Hãy thử chọn khoảng thời gian khác</p>
                </div>
            )}
        </div>
    );
};

export default StatisticDashboard;