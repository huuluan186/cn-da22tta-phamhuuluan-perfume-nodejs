import db from '../models/index.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const hashPassword= password => bcrypt.hashSync(password,bcrypt.genSaltSync(12));

export const getCurrentUserService  = async (userId) => {
    try {
        const user = await db.User.findByPk(userId, 
            {
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: db.Role,
                        as: 'roles',
                        attributes: ['name'],
                        through: { attributes: [] },
                    }
                ]
            },
            
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
            const value = updateData[key];
            if (value === '') {
                if (key === 'dateOfBirth') {
                    filteredData[key] = null;
                } else if (key === 'gender') {
                    filteredData[key] = null;  
                } else {
                    filteredData[key] = '';
                }
            } else if (value !== undefined && value !== null) {
                filteredData[key] = value;
            }
        }

        // tên lấy từ DB lên
        const currentFirstname = user.firstname || '';
        const currentLastname = user.lastname || '';

        // tên mới từ dữ liệu gửi lên (?? : lấy giá trị cũ nếu user không gửi trường đó)
        const newFirstname = filteredData.firstname ?? currentFirstname;
        const newLastname = filteredData.lastname ?? currentLastname;

        // Nếu người dùng xóa 1 trong 2 nhưng vẫn giữ cái kia → cập nhật cái còn lại
        // Nếu cả 2 đều rỗng → giữ nguyên giá trị cũ
        if (updateData.firstname.trim() === '' && updateData.lastname.trim() === '') {
            filteredData.firstname = currentFirstname;
            filteredData.lastname = currentLastname;
        } else {
            filteredData.firstname = newFirstname;
            filteredData.lastname = newLastname;
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
        const user = await db.User.findOne({ where: { email }, attributes: ['id'] });
        if (!user) {
            return {
                err: 1,
                msg: 'Email not found!',
            };
        }

        // Tạo token reset (hiệu lực 1 giờ) nếu email tồn tại
        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: '15m' });

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