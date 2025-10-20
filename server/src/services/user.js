import db from '../models/index.js'
import { Op } from 'sequelize'
import bcrypt from 'bcryptjs'

export const getCurrentUserService  = async (userId) => {
    try {
        const user = await db.User.findByPk(userId, 
            {
                attributes: { exclude: ['password'] }
            }
        );

        return {
            err: user ? 0 : 1,
            msg: user ? 'Get user info successfully' : 'User not found',
            user
        }
    } catch (error) {
        throw error
    }
}

export const updateCurrentUserService = async (userId, updateData) => {
    try {
        const user = await db.User.findByPk(userId);
        if (!user){
            return {
                err: 1,
                msg: 'User not found!',
                user: null
            }
        }
        
        const allowedFields = ['firstname', 'lastname', 'dateOfBirth', 'gender']

        // Lọc dữ liệu cập nhật để chỉ giữ các trường hợp lệ
        const filteredData = {};
        for (const  key of allowedFields) {
            if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== ''){
                filteredData[key] = updateData[key];
            }
        }

        await user.update(filteredData);

        return {
            err: 0,
            msg: 'User info updated successfully',
        }
    } catch (error) {
        throw error;
    }
}