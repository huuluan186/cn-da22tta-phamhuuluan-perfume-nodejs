import db from "../models/index.js";
import { getPagination, formatPaginatedResponse } from "../utils/index.js";
import { Op } from 'sequelize';

export const getAllReviewsAdminService = async (query = {}) => {
    try {
        const { page, limit, hasPagination = true, productId, rating, keyword, isApproved } = query;

        const { offset, limitNum, pageNum } = getPagination(
            page,
            limit,
            process.env.DEFAULT_PAGE_LIMIT || 10
        );

        const where = {};
        if (productId) {
            where['$orderItem.variant.productId$'] = productId;
        }
        if (rating) {
            where.rating = rating;
        }
        if (isApproved !== undefined) {
            where.isApproved = isApproved === 'true';
        }
        if (keyword) {
            where[Op.or] = [
                { title: { [Op.like]: `%${keyword}%` } },
                { content: { [Op.like]: `%${keyword}%` } },
                { '$user.firstname$': { [Op.like]: `%${keyword}%` } },
                { '$user.lastname$': { [Op.like]: `%${keyword}%` } },
            ];
        }

        const { rows, count } = await db.Review.findAndCountAll({
            paranoid: false, // hiển thị cả đã soft delete
            where,
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'firstname', 'lastname', 'email'],
                },
                {
                    model: db.OrderItem,
                    as: 'orderItem',
                    attributes: ['id'],
                    include: [
                        {
                            model: db.ProductVariant,
                            as: 'variant',
                            attributes: ['id', 'volume'],
                            include: [
                                {
                                    model: db.Product,
                                    as: 'product',
                                    attributes: ['id', 'name'],
                                }
                            ]
                        }
                    ]
                },
                {
                    model: db.ReviewImage,
                    as: 'reviewImages',
                    attributes: ['id', 'url', 'sortOrder'],
                }
            ],
            order: [['createdAt', 'DESC']],
            distinct: true,
            ...(hasPagination ? { offset, limit: limitNum } : {}),
        });

        return {
            err: 0,
            msg: 'Fetched reviews successfully',
            reviews: formatPaginatedResponse(
                rows,
                count,
                hasPagination ? pageNum : null,
                hasPagination ? limitNum : null
            ),
        };
    } catch (error) {
        throw error;
    }
};

export const deleteReviewAdminService = async (reviewId) => {
    try {
        const review = await db.Review.findByPk(reviewId);
        if (!review) {
            return { err: 1, msg: 'Review not found!' };
        }

        await review.destroy(); // soft delete nhờ paranoid

        return { err: 0, msg: 'Review deleted successfully' };
    } catch (error) {
        throw error;
    }
};

export const toggleReviewApprovalService = async (reviewId, isApproved) => {
    try {
        const review = await db.Review.findByPk(reviewId);
        if (!review) {
            return { err: 1, msg: 'Review not found!' };
        }

        await review.update({ isApproved: isApproved === 'true' || isApproved === true });

        return { 
            err: 0, 
            msg: `Review ${isApproved ? 'approved' : 'hidden'} successfully`,
            data: review 
        };
    } catch (error) {
        throw error;
    }
};

export const getReviewDetailAdminService = async (reviewId) => {
    try {
        const review = await db.Review.findByPk(reviewId, {
            paranoid: false, 
            attributes: {
                exclude: ['userId', 'orderItemId']
            },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'firstname', 'lastname', 'email'],
                    paranoid: false, // nếu User cũng có soft delete
                },
                {
                    model: db.OrderItem,
                    as: 'orderItem',
                    attributes: ['id', 'quantity', 'unitPrice'],
                    paranoid: false,
                    include: [
                        {
                            model: db.Order,
                            as: 'order',
                            attributes: ['id', 'orderStatus', 'createdAt'],
                            paranoid: false,
                        },
                        {
                            model: db.ProductVariant,
                            as: 'variant',
                            attributes: ['id', 'volume', 'price', 'discountPercent'],
                            paranoid: false,
                            include: [
                                {
                                    model: db.Product,
                                    as: 'product',
                                    attributes: ['id', 'name'],
                                    paranoid: false,
                                }
                            ]
                        }
                    ]
                },
                {
                    model: db.ReviewImage,
                    as: 'reviewImages',
                    attributes: ['id', 'url', 'sortOrder'],
                    order: [['sortOrder', 'ASC']],
                    paranoid: false,
                }
            ],
        });

        if (!review) {
            return { err: 1, msg: 'Review not found!' };
        }

        return {
            err: 0,
            msg: 'Fetched review detail successfully',
            review
        };
    } catch (error) {
        throw error;
    }
};