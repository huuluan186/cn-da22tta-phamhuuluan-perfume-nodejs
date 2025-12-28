import * as service from '../services/user.js'
import { changePasswordSchema, resetPasswordSchema, forgotPasswordSchema  } from '../validations/userValidation.js';
import { validateData } from '../validations/validation.js';

export const getCurrentUserController = async (req, res) => {
    try {
        const { id } = req.user; // Lấy ID người dùng từ token
        const response = await service.getCurrentUserService(id)
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at get current user controller: ' + error.message
        });
    }
}

export const updateCurrentUserController = async (req, res) => {
    try {
        const { id } = req.user;        // Lấy ID người dùng từ token
        const updateData = req.body;    // Dữ liệu cập nhật từ request body
        const response = await service.updateCurrentUserService(id, updateData);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at update current user controller: ' + error.message
        })
    }
}

export const changePasswordController = async (req, res) => {
    try {
        const { id } = req.user;     
        const { oldPassword, newPassword } = req.body; 
        // Validate dữ liệu
        const { valid, msg } = validateData(changePasswordSchema, { oldPassword, newPassword });
        if (!valid) return res.status(400).json({err: 1, msg});
        
        const response = await service.changePasswordService(id, { oldPassword, newPassword });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at change password controller: ' + error.message
        })
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        // Validate dữ liệu
        const { valid, msg } = validateData(forgotPasswordSchema, { email });
        if (!valid) return res.status(400).json({err: 1, msg});
        
        const response = await service.forgotPasswordService(email);
        return res.status(response.err ? 404 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Server error while sending reset link: ' + error.message,
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        // Validate dữ liệu
        const { valid, msg } = validateData(resetPasswordSchema, { token, newPassword });
        if (!valid) return res.status(400).json({err: 1, msg});

        const response = await service.resetPasswordService(token, newPassword);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Server error while resetting password: ' + error.message,
        });
    }
};


export const getAllUsersController = async (req, res) => {
    try {
        const query = req.query; 
        const response = await service.getAllUsersService(query);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed to get users!: '+error.message,
        });
    }
};

export const updateUserRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        let { roleIds } = req.body;

        if (typeof roleIds === 'string') {
            roleIds = [roleIds];
        }

        if (!Array.isArray(roleIds)) {
            return res.status(400).json({
                err: 1,
                msg: 'roleIds must be an array!',
            });
        }

        const response = await service.updateUserRoleService(id, roleIds);
        return res.status(response.err === 0 ? 200 : 400).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed to update user roles!: '+ error.message,
        });
    }
};

export const softDeleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await service.softDeleteUserService(id);
        return res.status(response.err === 0 ? 200 : 404).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Failed to delete user!: '+error.message,
        });
    }
};
