import * as service from '../services/cart.js'

export const getMyCartController = async (req, res) => {
    try {
        const { id } = req.user;
        const result = await service.getMyCartService(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Failed at getMyCartController: '+ error });
    }
}

export const addToCartController = async (req, res) => {
    try {
        const { id } = req.user;
        const { productVariantId, quantity } = req.body;
        const result = await service.addToCartService(id, productVariantId, quantity);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Failed at addToCartController: '+ error });
    }
}

export const updateCartItemController = async (req, res) => {
    try {
        const { id } = req.user;
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        const result = await service.updateCartItemService(id, cartItemId, quantity);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Failed at updateCartItemController: '+ error });
    }
}

export const deleteACartItemController = async (req, res) => {
    try {
        const { id } = req.user;
        const { cartItemId } = req.params;
        const result = await service.deleteACartItemService(id, cartItemId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Failed at deleteACartItemController: '+ error });
    }
}

export const clearCartController = async (req, res) => {
    try {
        const { id } = req.user;
        const result = await service.clearCartService(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Failed at clearCartController: '+ error });
    }
}