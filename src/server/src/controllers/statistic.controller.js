import * as statisticService from '../services/statistic.js';

export const getKPIs = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await statisticService.getKPIsService({ startDate, endDate });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getKPIs controller: ' + error.message });
    }
};

export const getRevenueTrend = async (req, res) => {
    try {
        const { startDate, endDate, groupBy } = req.query;
        const result = await statisticService.getRevenueTrendService({ startDate, endDate, groupBy });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getRevenueTrend controller: ' + error.message });
    }
};

export const getTopProducts = async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;
        const result = await statisticService.getTopProductsService({ startDate, endDate, limit });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getTopProducts controller: ' + error.message });
    }
};

export const getRevenueByCategory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await statisticService.getRevenueByCategoryService({ startDate, endDate });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getRevenueByCategory controller: ' + error.message });
    }
};

export const getRevenueByBrand = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await statisticService.getRevenueByBrandService({ startDate, endDate });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getRevenueByBrand controller: ' + error.message });
    }
};

export const getRevenueByPayment = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await statisticService.getRevenueByPaymentService({ startDate, endDate });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getRevenueByPayment controller: ' + error.message });
    }
};

export const getTopCustomers = async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;
        const result = await statisticService.getTopCustomersService({ startDate, endDate, limit });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getTopCustomers controller: ' + error.message });
    }
};