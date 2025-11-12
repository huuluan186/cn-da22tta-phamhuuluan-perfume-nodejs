import * as service from '../services/product.js';

export const getAllProductsController = async (req, res) => {
    try {
        const { page, limit, categoryId, brandIds, priceRange, rating, keyword, sort } = req.query;

        // Chuyển các giá trị filter từ query string sang object
        const filters = {
            categoryId: categoryId ? Number(categoryId) : undefined,
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