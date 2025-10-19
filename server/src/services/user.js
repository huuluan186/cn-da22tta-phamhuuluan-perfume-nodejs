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