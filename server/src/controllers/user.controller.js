import * as service from '../services/user.js'
import { validateData, changePasswordSchema, resetPasswordSchema, forgotPasswordSchema  } from '../validations/userValidation.js';

export const getCurrentUserController = async (req, res) => {
    try {
        const { id } = req.user // Lấy ID người dùng từ token
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