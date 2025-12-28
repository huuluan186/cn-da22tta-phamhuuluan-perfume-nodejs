import * as service from '../services/brand.js';


export const getPublicBrandsController  = async (req, res) => {
    try {
        const {sortBy, order} = req.query;
        const result = await service.getPublicBrandsService(sortBy, order);
        return res.status(result.err ? 400 : 200).json(result);
    } catch (error) {
        return res.status(500).json({ 
            err: 1, 
            msg: 'Failed at getPublicBrandsController controller: ' + error.message 
        });
    }
};

/**
 * GET ALL BRANDS (ADMIN)
 */
export const getAllBrandsController = async (req, res) => {
    try {
        const result = await service.getAllBrandsAdminService(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getAllBrandsController controller: ' + error.message,
        });
    }
};

/**
 * GET BRAND BY ID
 */
export const getBrandByIdController = async (req, res) => {
    try {
        const result = await service.getBrandByIdService(req.params.id);
        return res.status(result.err ? 404 : 200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at getBrandById controller: ' + error.message,
        });
    }
};

/**
 * CREATE BRAND
 */
export const createBrandController = async (req, res) => {
    try {
        const result = await service.createBrandService(req.body);
        return res.status(result.err ? 400 : 201).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at createBrand controller: ' + error.message,
        });
    }
};

/**
 * UPDATE BRAND
 */
export const updateBrandController = async (req, res) => {
    try {
        const result = await service.updateBrandService(req.params.id, req.body);
        return res.status(result.err ? 400 : 200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at updateBrand controller: ' + error.message,
        });
    }
};

/**
 * DELETE BRAND
 */
export const deleteBrandController = async (req, res) => {
    try {
        const result = await service.deleteBrandService(req.params.id);
        return res.status(result.err ? 400 : 200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed at deleteBrand controller: ' + error.message,
        });
    }
};
