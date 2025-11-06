import * as service from '../services/brand.js';

export const getAllBrandsController = async (req, res) => {
    try {
        const {sortBy, order} = req.query;
        const result = await service.getBrandsService(sortBy, order);
        return res.status(result.err ? 400 : 200).json(result);
    } catch (error) {
        return res.status(500).json({ 
            err: 1, 
            msg: 'Failed at getAllBrands controller: ' + error.message 
        });
    }
};

export const getBrandByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.getBrandByIdService(id);
        return res.status(result.err ? 400 : 200).json(result);
    } catch (error) {
        return res.status(500).json({ 
            err: 1, 
            msg: 'Failed at getBrandById controller: ' + error.message 
        });
    }
};
