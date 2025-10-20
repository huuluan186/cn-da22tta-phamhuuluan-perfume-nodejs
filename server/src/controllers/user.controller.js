import * as service from '../services/user.js'

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