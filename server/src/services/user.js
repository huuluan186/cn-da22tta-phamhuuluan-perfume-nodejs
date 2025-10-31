import db from '../models/index.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const hashPassword= password => bcrypt.hashSync(password,bcrypt.genSaltSync(12));

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
        for (const key of allowedFields) {
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

export const changePasswordService = async (userId, data) => {
    try {
        const { oldPassword, newPassword } = data;
        const user = await db.User.findByPk(userId);
        if (!user) {
            return {
                err: 1,
                msg: 'User not found!',
                user: null
            };
        }
        //Kiểm tra mật khẩu cũ
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            return {
                err: 1,
                msg: 'Old password is incorrect!',
            };
        }

        // Hash mật khẩu mới và cập nhật
        await user.update({ password: hashPassword(newPassword) });
        return {
            err: 0,
            msg: 'Password changed successfully!',
        };
    } catch (error) {
        throw error
    }
}

export const forgotPasswordService = async (email) => {
    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return {
                err: 1,
                msg: 'Email not found!',
            };
        }

        // Tạo token reset (hiệu lực 1 giờ) nếu email tồn tại
        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });

        return {
            err: 0,
            msg: 'Email found! Please use the token to reset your password.',
            token: resetToken
        };
    } catch (error) {
        throw error;
    }
};

export const resetPasswordService = async (token, newPassword) => {
    try {
        // Xác minh token
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const userId = decoded.id;

        const user = await db.User.findByPk(userId);
        if (!user) {
            return {
                err: 1,
                msg: 'Invalid or expired token!',
            };
        }

        // Hash mật khẩu mới và cập nhật
        await user.update({ password: hashPassword(newPassword) });

        return {
            err: 0,
            msg: 'Password reset successfully!',
        };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                err: 1,
                msg: 'Reset token has expired!',
            };
        }
        throw error;
    }
};