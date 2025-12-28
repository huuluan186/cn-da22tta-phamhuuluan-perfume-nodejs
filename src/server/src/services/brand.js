import db from '../models/index.js';
import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';
import { nanoid } from 'nanoid';

export const getPublicBrandsService  = async (sortBy = 'name', order = 'ASC') => {
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

export const getAllBrandsAdminService  = async (query = {}) => {
    try {
        const { page, limit, hasPagination, sortBy = 'createdAt', order = 'DESC' } = query;

        const { offset, limitNum, pageNum } = getPagination(
            page,
            limit,
            process.env.DEFAULT_PAGE_LIMIT
        );

        const { rows, count } = await db.Brand.findAndCountAll({
            paranoid: false,
            order: [
                ['deletedAt', 'ASC'],
                [sortBy, order.toUpperCase()],
                ['name', 'ASC'],
            ],
            ...(hasPagination ? { offset, limit: limitNum } : {}),
        });

        return { 
            err: 0,
            msg: 'Fetched brands successfully', 
            brands: formatPaginatedResponse(
                rows,
                count,
                hasPagination ? pageNum : null,
                hasPagination ? limitNum : null
            ),
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

/**
 * CREATE BRAND
 */
export const createBrandService = async (payload) => {
    try {
        const existed = await db.Brand.findOne({
            where: { name: payload.name },
        });

        if (existed) {
            return {
                err: 1,
                msg: 'Brand already exists!',
            };
        }

        const brand = await db.Brand.create({
            id: nanoid(4),
            name: payload.name || null,
            country: payload.country,
            logoUrl: payload.logoUrl,
            posterUrl: payload.posterUrl,
            description: payload.description || '',
        });

        return {
            err: 0,
            msg: 'Brand created successfully!',
            response: brand,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * UPDATE BRAND
 */
export const updateBrandService = async (brandId, payload) => {
    try {
        const brand = await db.Brand.findByPk(brandId);

        if (!brand)
            return { err: 1, msg: 'Brand not found!' };

        const updateData = {};

        // NAME (unique)
        if (payload.name?.trim()) {
            const existed = await db.Brand.findOne({
                where: {
                    name: payload.name.trim(),
                    id: { [db.Sequelize.Op.ne]: brandId },
                    deletedAt: null, // Ensure we only check against non-deleted brands
                },
            });

            if (existed)
                return { err: 1, msg: 'Brand name already exists!' };

            updateData.name = payload.name.trim();
        }

        // COUNTRY
        if (payload.country?.trim()) {
            updateData.country = payload.country.trim();
        }

        // LOGO
        if (payload.logoUrl?.trim()) {
            updateData.logoUrl = payload.logoUrl.trim();
        }

        // POSTER
        if (payload.posterUrl?.trim()) {
            updateData.posterUrl = payload.posterUrl.trim();
        }

        // DESCRIPTION
        if (payload.description !== undefined) {
            updateData.description = payload.description || '';
        }

        await brand.update(updateData);

        return {
            err: 0,
            msg: 'Brand updated successfully!',
        };
    } catch (error) {
        throw error;
    }
};


/**
 * DELETE BRAND (SOFT DELETE)
 */
export const deleteBrandService = async (brandId) => {
    try {
        const brand = await db.Brand.findByPk(brandId, {
            include: [
                {
                    model: db.Product,
                    as: 'products',
                    attributes: ['id'],
                },
            ],
        });

        if (!brand) {
            return {
                err: 1,
                msg: 'Brand not found!',
            };
        }

        await brand.destroy(); // soft delete

        return {
            err: 0,
            msg: 'Brand deleted successfully!',
        };
    } catch (error) {
        throw error;
    }
};