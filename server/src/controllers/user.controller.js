import * as service from '../services/user.js'

export const getCurrentUserController = async (req, res) => {
    try {
        const { id } = req.user 
        const response = await service.getCurrentUserService(id)
        return res.status(response.err ? 400 : 200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at get current user controller: ' + error.message
        });
    }
}