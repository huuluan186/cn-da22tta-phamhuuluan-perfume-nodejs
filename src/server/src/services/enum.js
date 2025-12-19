import db from '../models/index.js';

export const getAllRolesService = async () => {
    try {
        const roles = await db.Role.findAll({
            attributes: ['id', 'name', 'description'],
            order: [['name', 'ASC']]
        });

        return {
            err: 0,
            msg: 'Get roles successfully',
            roles
        };
    } catch (error) {
        throw error;
    }
};