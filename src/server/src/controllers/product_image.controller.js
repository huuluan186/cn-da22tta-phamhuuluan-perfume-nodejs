import * as service from '../services/product_image.js';

/**
 * ===============================
 * ADD PRODUCT IMAGES
 * POST /api/admin/products/:id/images
 * ===============================
 */
export const addProductImages = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { images } = req.body;

        if (!productId || !images?.length)
            return res.status(400).json({
                err: 1,
                msg: 'Product ID and images are required',
            });

        const response = await service.addProductImagesService(productId, images);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at addProductImages: ' + error.message,
        });
    }
};

/**
 * ===============================
 * DELETE PRODUCT IMAGE
 * DELETE /api/admin/images/:id
 * ===============================
 */
export const deleteProductImage = async (req, res) => {
    try {
        const { id: imageId } = req.params;

        if (!imageId)
            return res.status(400).json({
                err: 1,
                msg: 'Missing image ID',
            });

        const response = await service.deleteProductImageService(imageId);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at deleteProductImage: ' + error.message,
        });
    }
};

export const setThumbnail = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { imageId } = req.body;

        if (!productId || !imageId) {
        return res.status(400).json({
            err: 1,
            msg: "Missing productId or imageId",
        });
        }

        // Gọi service xử lý logic
        const response = await service.setThumbnailService(productId, imageId);

        return res.status(response.err ? 400 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Failed to set thumbnail: " + error.message,
        });
    }
};