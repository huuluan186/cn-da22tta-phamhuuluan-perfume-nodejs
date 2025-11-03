import db from '../models/index.js';

export const getBrandsService = async (sortBy = 'name', order = 'ASC') => {
    try {
        const brands = await db.Brand.findAll({
            order: [
                [sortBy, order.toUpperCase()],
                ['createdAt', 'DESC'] // tiêu chí phụ
            ],
        });
        return { 
            err: brands ? 0 : 1,
            msg: brands ? 'Fetched brands successfully' : 'No brands found', 
            brands: brands ? brands : null
        };
    } catch (error) {
        throw error;
    }
};

export const getBrandByIdService = async (id) => {
    try {
        const brand = await db.Brand.findByPk(id);
        if (!brand) return { err: 1, msg: 'Brand not found' };
        return { err: 0, msg: 'Fetched brand successfully', brand };
    } catch (error) {
        throw error;
    }
};
