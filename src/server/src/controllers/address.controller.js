import * as service from '../services/address.js'
import { addressSchema } from '../validations/addressValidation.js'
import { validateData } from '../validations/validation.js';

export const getUserAddressesController = async (req, res) => {
    try {
        const { id } = req.user;
        const response = await service.getMyAddressesService(id);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at get user addresses controller: ' + error.message
        });
    }   
}

export const addUserAddressController = async (req, res) => {
    try {
        const { valid, msg, data } = validateData(addressSchema, req.body);
        if (!valid) return res.status(400).json({ err: 1, msg: msg });
        const { id } = req.user;
        const response = await service.addUserAddressService({...data, userId: id});
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at add user address controller: ' + error.message
        });
    }   
}

export const updateUserAddressController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params; 
        const updateData = req.body || {};    
        const response = await service.updateUserAddressService( addressId, userId, updateData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at update user address controller: ' + error.message
        })
    }
}

export const deleteUserAddressController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;

        const response = await service.deleteUserAddressService(userId, addressId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at delete user address controller: ' + error.message
        });
    }
};

