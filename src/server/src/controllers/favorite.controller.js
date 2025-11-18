import * as service from '../services/favorite.js';

// Thêm sản phẩm vào favorites của user
export const addMyFavoriteController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const result = await service.addFavoriteService(userId, productId);
        return res.status(result.err === 0 ? 200 : 400).json(result);

    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at addFavoriteController: ' + error });
    }
};

export const removeMyFavoriteController = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const result = await service.removeFavoriteService(userId, productId);
        return res.status(result.err === 0 ? 200 : 404).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at removeFavoriteController: ' + error });
    }
};

export const getMyFavoritesController = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await service.getMyFavoritesService(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getFavoritesByUserController: ' + error });
    }
};

export const getAllFavoritesController = async (req, res) => {
    try {
        const result = await service.getAllFavoritesService();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed at getAllFavoritesController: ' + error });
    }
};
