import * as service from "../services/enum.js";

export const getAllRolesController = async (req, res) => {
    try {
        const response = await service.getAllRolesService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed to get roles: '+ error
        });
    }
};