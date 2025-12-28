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

/**
 * GET ALL CATEGORIES (ADMIN)
 */
export const getAllCategoriesAdminController = async (req, res) => {
    try {
        const result = await service.getAllCategoriesAdminService(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getAllCategoriesController: ' + error.message,
        });
    }
};

/**
 * GET CATEGORY BY ID
 */
export const getCategoryByIdController = async (req, res) => {
    try {
        const result = await service.getCategoryByIdService(req.params.id);
        return res.status(result.err ? 404 : 200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getCategoryByIdController: ' + error.message,
        });
    }
};

/**
 * CREATE CATEGORY
 */
export const createCategoryController = async (req, res) => {
    try {
        const result = await service.createCategoryService(req.body);
        return res.status(result.err ? 400 : 201).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at createCategoryController: ' + error.message,
        });
    }
};

/**
 * UPDATE CATEGORY
 */
export const updateCategoryController = async (req, res) => {
    try {
        const result = await service.updateCategoryService(req.params.id, req.body);
        return res.status(result.err ? 400 : 200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at updateCategoryController: ' + error.message,
        });
    }
};

/**
 * DELETE CATEGORY
 */
export const deleteCategoryController = async (req, res) => {
    try {
        const result = await service.deleteCategoryService(req.params.id);
        return res.status(result.err ? 400 : 200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at deleteCategoryController: ' + error.message,
        });
    }
};
