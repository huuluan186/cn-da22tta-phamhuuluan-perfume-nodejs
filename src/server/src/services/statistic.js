import db from '../models/index.js'
import { Op } from 'sequelize'

/**
 * ===============================
 * COMMON WHERE CLAUSE
 * ===============================
 */
const getWhereClause = (startDate, endDate) => {
    const where = {
        // Chỉ tính những đơn hàng đã được xác nhận trở lên (không tính Processing)
        orderStatus: { [Op.in]: ['Confirmed', 'Shipped', 'Completed'] },
        [Op.or]: [
            { paymentMethod: 'COD' },
            {
                paymentMethod: 'ZaloPay',
                paymentStatus: { [Op.in]: ['Confirmed', 'Completed', 'Paid'] }
            }
        ]
    }

    if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt[Op.gte] = new Date(startDate)

        if (endDate) {
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)
            where.createdAt[Op.lte] = end
        }
    }

    return where
}

/**
 * ===============================
 * 1. KPIs
 * ===============================
 */
export const getKPIsService = async ({ startDate, endDate }) => {
    try {
        const where = getWhereClause(startDate, endDate)

        // Đơn đã duyệt (đã xác nhận trở lên)
        const approvedOrders = await db.Order.findOne({
            where,
            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 'totalRevenue'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalOrders']
            ],
            raw: true
        })

        // Đơn chưa duyệt (Processing hoặc Pending)
        const dateWhere = {}
        if (startDate || endDate) {
            dateWhere.createdAt = {}
            if (startDate) dateWhere.createdAt[Op.gte] = new Date(startDate)
            if (endDate) {
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                dateWhere.createdAt[Op.lte] = end
            }
        }

        const pendingOrders = await db.Order.count({
            where: {
                ...dateWhere,
                orderStatus: { [Op.in]: ['Processing', 'Pending'] }
            }
        })

        const totalProductsSold = await db.OrderItem.sum('quantity', {
            include: [{ model: db.Order, as: 'order', where, attributes: [] }]
        })

        const totalRevenue = Number(approvedOrders?.totalRevenue) || 0;
        const approvedOrdersCount = Number(approvedOrders?.totalOrders) || 0;

        return {
            err: 0,
            msg: 'Get KPIs successfully',
            response: {
                totalRevenue: totalRevenue,
                approvedOrders: approvedOrdersCount,
                pendingOrders: Number(pendingOrders) || 0,
                avgOrderValue: approvedOrdersCount > 0 
                    ? Number((totalRevenue / approvedOrdersCount).toFixed(2))
                    : 0,
                totalProductsSold: Number(totalProductsSold) || 0
            }
        }
    } catch (error) {
        throw error
    }
}

/**
 * ===============================
 * 2. Revenue Trend
 * ===============================
 */
export const getRevenueTrendService = async ({ startDate, endDate, groupBy = 'day' }) => {
    try {
        const where = getWhereClause(startDate, endDate)
        const formatMap = {
            day: '%Y-%m-%d',
            week: '%x-%v',
            month: '%Y-%m',
            year: '%Y'
        }

        const period = db.sequelize.fn(
            'DATE_FORMAT',
            db.sequelize.col('createdAt'),
            formatMap[groupBy]
        )

        const rows = await db.Order.findAll({
            where,
            attributes: [
                [period, 'period'],
                [db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 'revenue'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'orderCount']
            ],
            group: ['period'],
            order: [['period', 'ASC']],
            raw: true
        })

        return {
            err: 0,
            msg: 'Get revenue trend successfully',
            response: rows.map(r => ({
                period: r.period,
                revenue: Number(r.revenue || 0),
                orderCount: Number(r.orderCount || 0)
            }))
        }
    } catch (error) {
       throw error
    }
}

/**
 * ===============================
 * 3. Top Products
 * ===============================
 */
export const getTopProductsService = async ({ startDate, endDate, limit = 10 }) => {
    try {
        const where = getWhereClause(startDate, endDate)

        const rows = await db.OrderItem.findAll({
            include: [
                { model: db.Order, as: 'order', where, attributes: [] },
                {
                    model: db.ProductVariant,
                    as: 'variant',
                    attributes: [], // 🔥 FIX ONLY_FULL_GROUP_BY
                    include: [{
                        model: db.Product,
                        as: 'product',
                        attributes: ['id', 'name']
                    }]
                }
            ],
            attributes: [
                [db.sequelize.col('variant->product.id'), 'productId'],
                [db.sequelize.col('variant->product.name'), 'productName'],
                [db.sequelize.fn('SUM', db.sequelize.literal('quantity * unitPrice')), 'revenue'],
                [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'quantity']
            ],
            group: [
                'variant->product.id',
                'variant->product.name'
            ],
            order: [[db.sequelize.literal('revenue'), 'DESC']],
            limit: +limit,
            raw: true
        })

        return {
            err: 0,
            msg: 'Get top products successfully',
            response: rows.map(r => ({
                productName: r.productName,
                revenue: Number(r.revenue || 0),
                quantity: Number(r.quantity || 0)
            }))
        }
    } catch (error) {
        throw error
    }
}

/**
 * ===============================
 * 4. Revenue By Category
 * ===============================
 */
export const getRevenueByCategoryService = async ({ startDate, endDate }) => {
    try {
        const where = getWhereClause(startDate, endDate)

        const rows = await db.OrderItem.findAll({
            include: [
                { model: db.Order, as: 'order', where, attributes: [] },
                {
                    model: db.ProductVariant,
                    as: 'variant',
                    attributes: [],
                    include: [{
                        model: db.Product,
                        as: 'product',
                        attributes: [],
                        include: [{
                            model: db.Category,
                            as: 'categories',
                            attributes: ['id', 'name'],
                            through: { attributes: [] }
                        }]
                    }]
                }
            ],
            attributes: [
                [db.sequelize.col('variant->product->categories.id'), 'categoryId'],
                [db.sequelize.col('variant->product->categories.name'), 'categoryName'],
                [db.sequelize.fn('SUM', db.sequelize.literal('quantity * unitPrice')), 'revenue']
            ],
            group: [
                'variant->product->categories.id',
                'variant->product->categories.name'
            ],
            order: [[db.sequelize.literal('revenue'), 'DESC']],
            raw: true
        })

        return {
            err: 0,
            msg: 'Get revenue by category successfully',
            response: rows.map(r => ({
                categoryName: r.categoryName || 'Uncategorized',
                revenue: Number(r.revenue || 0)
            }))
        }
    } catch (error) {
        throw error
    }
}

/**
 * ===============================
 * 5. Revenue By Brand
 * ===============================
 */
export const getRevenueByBrandService = async ({ startDate, endDate }) => {
    try {
        const where = getWhereClause(startDate, endDate)

        const rows = await db.OrderItem.findAll({
            include: [
                { model: db.Order, as: 'order', where, attributes: [] },
                {
                    model: db.ProductVariant,
                    as: 'variant',
                    attributes: [],
                    include: [{
                        model: db.Product,
                        as: 'product',
                        attributes: [],
                        include: [{
                            model: db.Brand,
                            as: 'brand',
                            attributes: ['id', 'name']
                        }]
                    }]
                }
            ],
            attributes: [
                [db.sequelize.col('variant->product->brand.id'), 'brandId'],
                [db.sequelize.col('variant->product->brand.name'), 'brandName'],
                [db.sequelize.fn('SUM', db.sequelize.literal('quantity * unitPrice')), 'revenue']
            ],
            group: [
                'variant->product->brand.id',
                'variant->product->brand.name'
            ],
            order: [[db.sequelize.literal('revenue'), 'DESC']],
            raw: true
        })

        return {
            err: 0,
            msg: 'Get revenue by brand successfully',
            response: rows.map(r => ({
                brandName: r.brandName || 'No Brand',
                revenue: Number(r.revenue || 0)
            }))
        }
    } catch (error) {
        throw error
    }
}

/**
 * ===============================
 * 6. Revenue By Payment Method
 * ===============================
 */
export const getRevenueByPaymentService = async ({ startDate, endDate }) => {
    try {
        const where = getWhereClause(startDate, endDate)

        const rows = await db.Order.findAll({
            where,
            attributes: [
                'paymentMethod',
                [db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 'revenue']
            ],
            group: ['paymentMethod'],
            order: [[db.sequelize.literal('revenue'), 'DESC']],
            raw: true
        })

        return {
            err: 0,
            msg: 'Get revenue by payment method successfully',
            response: rows.map(r => ({
                paymentMethod: r.paymentMethod,
                revenue: Number(r.revenue || 0)
            }))
        }
    } catch (error) {
        throw error
    }
}

/**
 * ===============================
 * 7. Top Customers
 * ===============================
 */
export const getTopCustomersService = async ({ startDate, endDate, limit = 5 }) => {
    try {
        const where = getWhereClause(startDate, endDate)

        const rows = await db.Order.findAll({
            where,
            attributes: [
                'userId',
                [db.sequelize.fn('COUNT', db.sequelize.col('Order.id')), 'orderCount'],
                [db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 'totalSpent']
            ],
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['firstname', 'lastname', 'email'] 
            }],
            group: [
                'Order.userId',
                'user.id',
                'user.firstname',
                'user.lastname',
                'user.email'
            ],
            order: [[db.sequelize.literal('totalSpent'), 'DESC']],
            limit: +limit,
            raw: true,
            nest: true
        })

        return {
            err: 0,
            msg: 'Get top customers successfully',
            response: rows.map(r => ({
                name: `${r.user?.firstname || ''} ${r.user?.lastname || ''}`.trim() || 'Guest',
                email: r.user?.email,
                orderCount: Number(r.orderCount || 0),
                totalSpent: Number(r.totalSpent || 0)
            }))
        }
    } catch (error) {
        throw error
    }
}
