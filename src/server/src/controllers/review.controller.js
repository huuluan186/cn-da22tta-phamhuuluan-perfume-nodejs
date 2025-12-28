import * as service from '../services/review.js';

export const getAllReviewsAdmin = async (req, res) => {
    try {
        const { page, limit, hasPagination, productId, rating, keyword, isApproved } = req.query;

        const response = await service.getAllReviewsAdminService({
            page,
            limit,
            hasPagination: hasPagination === 'true',
            productId,
            rating,
            keyword,
            isApproved,
        });

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getAllReviewsAdmin: ' + error.message,
        });
    }
};

export const deleteReviewAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ err: 1, msg: 'Missing review ID' });
        }

        const response = await service.deleteReviewAdminService(id);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at deleteReviewAdmin: ' + error.message,
        });
    }
};

export const toggleReviewApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body; // true/false

        if (!id) {
            return res.status(400).json({ err: 1, msg: 'Missing review ID' });
        }
        if (isApproved === undefined) {
            return res.status(400).json({ err: 1, msg: 'isApproved field is required' });
        }

        const response = await service.toggleReviewApprovalService(id, isApproved);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at toggleReviewApproval: ' + error.message,
        });
    }
};

export const getReviewDetailAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing review ID',
            });
        }

        const response = await service.getReviewDetailAdminService(id);

        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getReviewDetailAdmin: ' + error.message,
        });
    }
};