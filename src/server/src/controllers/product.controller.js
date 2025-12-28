import * as service from '../services/product.js';

export const getAllProductsController = async (req, res) => {
    try {
        const { page, limit, categoryId, brandIds, priceRange, rating, keyword, sort } = req.query;

        // Chuyển các giá trị filter từ query string sang object
        const filters = {
            categoryId: categoryId || undefined,
            brandIds: brandIds ? brandIds.split(',').map(id => +id) : undefined,
            priceRange: priceRange ? priceRange.split(',').map(p => +p) : undefined,
            rating: rating ? +rating : undefined,
            keyword,
            sort
        };
        const result = await service.getAllProductsService(page, limit, filters);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getAllProductsController: ' + error,
        });
    }
} 

export const getProductDetailController = async (req, res) => {
    try {
        const { productId } = req.params
        if(!productId) return res.status(400).json({
            err: 1,
            msg: 'Missing product ID'
        });
        const response = await service.getProductDetailService(productId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getProductDetailController: ' + error,
        });
    }
}

export const getProductReviewsController = async (req, res) => {
    try {
        const { productId } = req.params
        if(!productId) return res.status(400).json({
            err: 1,
            msg: 'Missing product ID'
        });
        const response = await service.getProductReviewsService(productId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getProductReviewsController: ' + error,
        });
    }
}

export const addProductReviewsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderItemId, title, content, rating, images } = req.body || {};
        if (!orderItemId || !orderItemId.trim()) {
            return res.status(400).json({
                err: 1,
                msg: "orderItemId is required."
            });
        }
        const result = await service.addProductReviewsService({
            userId,
            orderItemId,
            title,
            content,
            rating,
            images
        });
        return res.status(result.err ? 400 : 201).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at addProductReviewsController: ' + error,
        });
    }
}

/**
 * ===============================
 * GET ALL PRODUCTS (ADMIN)
 * GET /api/admin/products
 * ===============================
 */
export const getAllProductsAdmin = async (req, res) => {
    try {
        const { page, limit, hasPagination } = req.query;

        const response = await service.getAllProductsAdminService({
            page,
            limit,
            hasPagination: hasPagination === 'true',
        });

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getAllProductsAdmin: ' + error.message,
        });
    }
};


/**
 * ===============================
 * CREATE PRODUCT (ADMIN)
 * POST /api/admin/products
 * ===============================
 */
export const createProduct = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload?.name)
            return res.status(400).json({
                err: 1,
                msg: 'Product name is required',
            });

        const response = await service.createProductService(payload);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at createProduct: ' + error.message,
        });
    }
};

/**
 * ===============================
 * UPDATE PRODUCT (ADMIN)
 * PUT /api/admin/products/:id
 * ===============================
 */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        if (!id)
            return res.status(400).json({
                err: 1,
                msg: 'Missing product ID',
            });

        const response = await service.updateProductService(id, payload);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at updateProduct: ' + error.message,
        });
    }
};

/**
 * ===============================
 * DELETE PRODUCT (SOFT)
 * DELETE /api/admin/products/:id
 * ===============================
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id)
            return res.status(400).json({
                err: 1,
                msg: 'Missing product ID',
            });

        const response = await service.deleteProductService(id);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at deleteProduct: ' + error.message,
        });
    }
};