import * as service from '../services/product_variant.js';

/**
 * ===============================
 * CREATE VARIANT
 * POST /api/admin/products/:id/variants
 * ===============================
 */
export const createVariant = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const payload = req.body;

        if (!productId)
            return res.status(400).json({
                err: 1,
                msg: 'Missing product ID',
            });

        const response = await service.createVariantService(productId, payload);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at createVariant: ' + error.message,
        });
    }
};

/**
 * ===============================
 * UPDATE VARIANT
 * PUT /api/admin/variants/:id
 * ===============================
 */
export const updateVariant = async (req, res) => {
    try {
        const { id: variantId } = req.params;
        const payload = req.body;

        if (!variantId)
            return res.status(400).json({
                err: 1,
                msg: 'Missing variant ID',
            });

        const response = await service.updateVariantService(variantId, payload);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at updateVariant: ' + error.message,
        });
    }
};

/**
 * ===============================
 * DELETE VARIANT (SOFT)
 * DELETE /api/admin/variants/:id
 * ===============================
 */
export const deleteVariant = async (req, res) => {
    try {
        const { id: variantId } = req.params;

        if (!variantId)
            return res.status(400).json({
                err: 1,
                msg: 'Missing variant ID',
            });

        const response = await service.deleteVariantService(variantId);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at deleteVariant: ' + error.message,
        });
    }
};
