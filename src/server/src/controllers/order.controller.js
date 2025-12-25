import * as orderService from '../services/order.js';

export const createOrderController = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { addressId, couponCode, paymentMethod } = req.body;

        const result = await orderService.createOrderService(
            userId,
            addressId,
            couponCode,
            paymentMethod || 'COD'
        );
        return res.status(result.err ? 400 : 201).json(result);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at create order controller: ' + error.message
        })
    }
};

export const getMyOrdersController = async (req, res) => {
    try {
        const userId = req.user.id; 
        const query = req.query;        
        const result = await orderService.getMyOrdersService(userId, query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at getMyOrders controller: ' + error.message
        })
    }
};

export const getAllOrdersController = async (req, res) => {
    try {
        const query = req.query;
        const result = await orderService.getAllOrdersService(query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: -1,    
            msg: 'Failed at getAllOrders controller: ' + error.message
        })
    }
};


// Xem chi tiết 1 đơn hàng
export const getOrderDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await orderService.getOrderByIdService(id);
        if (result.err) return res.status(404).json(result);
        res.json(result);
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Server error' });
    }
};

// Cập nhật trạng thái đơn hàng
export const confirmOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await orderService.confirmOrderService(id);

        if (result.err) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Lỗi server' });
    }
};