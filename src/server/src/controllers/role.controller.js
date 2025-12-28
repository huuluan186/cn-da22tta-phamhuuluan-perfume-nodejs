import * as service from '../services/role.js';

/**
 * ===================== GET ALL ROLES =====================
 * GET /api/roles
 */
export const getAllRolesController = async (req, res) => {
    try {
        const response = await service.getAllRolesService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at get all roles controller: ' + error.message,
        });
    }
};

/**
 * ===================== CREATE ROLE =====================
 * POST /api/roles
 */
export const createRoleController = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                err: 1,
                msg: 'Role name are required!',
            });
        }

        const response = await service.createRoleService({ name, description });

        return res.status(response.err === 0 ? 201 : 400).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at create role controller: ' + error.message,
        });
    }
};

/**
 * ===================== UPDATE ROLE =====================
 * PUT /api/roles/:id
 */
export const updateRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                err: 1,
                msg: 'Role id is required!',
            });
        }

        const response = await service.updateRoleService(id, updateData);

        return res.status(response.err === 0 ? 200 : 404).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at update role controller: ' + error.message,
        });
    }
};

/**
 * ===================== DELETE ROLE (SOFT DELETE) =====================
 * DELETE /api/roles/:id
 */
export const deleteRoleController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                err: 1,
                msg: 'Role id is required!',
            });
        }

        const response = await service.deleteRoleService(id);

        return res.status(response.err === 0 ? 200 : 400).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at delete role controller: ' + error.message,
        });
    }
};
