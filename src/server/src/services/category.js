import db from "../models/index.js";

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
