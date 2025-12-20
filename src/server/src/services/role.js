import db from '../models/index.js'
import { v4 as uuidv4 } from 'uuid';
/**
 * GET ALL ROLES (no pagination)
 */
export const getAllRolesService = async () => {
    try {
        const roles = await db.Role.findAll({
            paranoid: false,
            order: [['createdAt', 'ASC']],
        });

        return {
            err: 0,
            msg: 'Get roles successfully',
            response: roles,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * CREATE ROLE
 */
export const createRoleService = async ({ name, description }) => {
    try {
        const existedRole = await db.Role.findOne({
            where: { name },
        });

        if (existedRole) {
            return {
                err: 1,
                msg: 'Role already exists!',
            };
        }

        const role = await db.Role.create({
            id: uuidv4(),
            name,
            description: description ||'',
        });

        return {
            err: 0,
            msg: 'Role created successfully!',
            response: role,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * UPDATE ROLE
 */
export const updateRoleService = async (roleId, payload) => {
    try {
        const role = await db.Role.findByPk(roleId, { paranoid: false });

        if (!role) {
            return {
                err: 1,
                msg: 'Role not found!',
            };
        }

        if (payload.name) {
            const existedRole = await db.Role.findOne({
                where: {
                    name: payload.name,
                    id: { [db.Sequelize.Op.ne]: roleId }, // khác role hiện tại
                },
                paranoid: false,
            });

            if (existedRole) {
                return {
                    err: 1,
                    msg: 'Role name already exists!',
                };
            }
        }

        await role.update(payload);

        return {
            err: 0,
            msg: 'Role updated successfully!',
        };
    } catch (error) {
        throw error;
    }
};

/**
 * DELETE ROLE (SOFT DELETE)
 */
export const deleteRoleService = async (roleId) => {
    try {
        const role = await db.Role.findByPk(roleId, {
            include: [
                {
                    model: db.User,
                    as: 'users',
                    attributes: ['id'],
                },
            ],
        });

        if (!role) {
            return {
                err: 1,
                msg: 'Role not found!',
            };
        }

        // 🔥 Không cho xóa role admin
        if (role.name === 'admin') {
            return {
                err: 1,
                msg: 'Cannot delete admin role!',
            };
        }

        // 🔥 Không cho xóa role đang được gán user
        if (role.users?.length > 0) {
            return {
                err: 1,
                msg: 'Cannot delete role that is assigned to users!',
            };
        }

        await role.destroy(); // soft delete

        return {
            err: 0,
            msg: 'Role deleted successfully!',
        };
    } catch (error) {
        throw error;
    }
};
