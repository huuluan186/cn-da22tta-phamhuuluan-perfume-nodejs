import * as service from '../services/category.js';

export const getAllCategoriesController = async (req, res) => {
    try {
        const result = await service.getAllCategoriesService();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getAllCategoriesController: ' + error,
        });
    }
} 