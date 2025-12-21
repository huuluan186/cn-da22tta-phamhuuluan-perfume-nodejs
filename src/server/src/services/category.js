import db from "../models/index.js";
import { getPagination, formatPaginatedResponse, slugify } from '../utils/index.js';
import { nanoid } from 'nanoid';
import { Op } from "sequelize";

export const getAllCategoriesService = async () => {
    try {
        const categories = await db.Category.findAll({
            order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
        });
        return {
            err: categories ? 0 : 1,
            msg: categories ? 'Get all categories successfully!' : 'No categories found!',
            response: categories ? categories : null
        }
    } catch (error) {
        throw error
    }
};


/**
 * GET ALL CATEGORIES (ADMIN)
 */
export const getAllCategoriesAdminService = async (query = {}) => {
    try {
        const { page, limit, hasPagination, sortBy = 'createdAt', order = 'DESC' } = query;

        const { offset, limitNum, pageNum } = getPagination(
            page,
            limit,
            process.env.DEFAULT_PAGE_LIMIT
        );

        const { rows, count } = await db.Category.findAndCountAll({
            paranoid: false,
            order: [
                [sortBy, order.toUpperCase()],
                ['name', 'ASC'],
            ],
            ...(hasPagination ? { offset, limit: limitNum } : {}),
        });

        return {
            err: 0,
            msg: 'Fetched categories successfully',
            categories: formatPaginatedResponse(
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

/**
 * GET CATEGORY BY ID
 */
export const getCategoryByIdService = async (id) => {
    try {
        const category = await db.Category.findByPk(id, {paranoid: false});
        if (!category) return { err: 1, msg: 'Category not found' };

        return {
            err: 0,
            msg: 'Fetched category successfully',
            category,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * CREATE CATEGORY
 */
export const createCategoryService = async (payload) => {
    try {

        if (!payload.name || !payload.name.trim()) {
            return {
                err: 1,
                msg: 'Category name is required!',
            };
        }

        const slug = slugify(payload.name.trim(), { lower: true, strict: true });

        const existed = await db.Category.findOne({
            where: { slug },
            paranoid: false, 
        });

        if (existed) {
            return { err: 1, msg: 'Category already exists!' };
        }

        const category = await db.Category.create({
            id: nanoid(4),
            name: payload.name || null,
            slug,
            parentId: payload.parentId || null,
            sortOrder: payload.sortOrder || 0,
        });

        return {
            err: 0,
            msg: 'Category created successfully!',
            response: category,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * UPDATE CATEGORY
 */
export const updateCategoryService = async (categoryId, payload) => {
    try {
        const category = await db.Category.findByPk(categoryId);

        if (!category)
            return { err: 1, msg: 'Category not found!' };

        const updateData = {};

        if (payload.name?.trim()) {
            const slug = slugify(payload.name, { lower: true, strict: true });

            const existed = await db.Category.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: categoryId },
                },
                paranoid: false,
            });

            if (existed)
                return { err: 1, msg: 'Category name already exists!' };

            updateData.name = payload.name.trim();
            updateData.slug = slug;
        }

        if (payload.parentId !== undefined) {
            updateData.parentId = payload.parentId || null;
        }

        if (payload.sortOrder !== undefined) {
            updateData.sortOrder = payload.sortOrder;
        }

        await category.update(updateData);

        return {
            err: 0,
            msg: 'Category updated successfully!',
        };
    } catch (error) {
        throw error;
    }
};

/**
 * DELETE CATEGORY (SOFT DELETE)
 */
export const deleteCategoryService = async (categoryId) => {
    try {
        const category = await db.Category.findByPk(categoryId);

        if (!category)
            return { err: 1, msg: 'Category not found!' };

        await category.destroy(); // soft delete

        return {
            err: 0,
            msg: 'Category deleted successfully!',
        };
    } catch (error) {
        throw error;
    }
};

