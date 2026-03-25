import db from '../models/index.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendResetPasswordEmail } from '../utils/index.js';
import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';

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

        // Tìm xem user có bản ghi AuthProvider hay không
        const socialAccount = await db.AuthProvider.findOne({ where: { userId } });

        return {
            err: user ? 0 : 1,
            msg: user ? 'Get user info successfully' : 'User not found',
            user: user 
                ? {
                    ...user.toJSON(),
                    isSocialAccount: !!socialAccount   // flag
                } : null,
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
        if (updateData.firstname?.trim() === '' && updateData.lastname?.trim() === '') {
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
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findOne({
            where: { email },
            attributes: ['id', 'email', 'firstname', 'lastname', 'password'],
            transaction
        });
        // Luôn trả về thành công dù email có tồn tại hay không, chống enum
        if (!user) {
            await transaction.commit();
            return {
                err: 0,
                msg: 'Nếu email tồn tại, link đặt lại mật khẩu sẽ được gửi ngay.',
            };
        }

        // Tạo token reset (hiệu lực 15p) - Dùng secret động: SECRET + password hash
        // Nếu user đổi mật khẩu -> password hash thay đổi -> token cũ vô hiệu
        const secret = process.env.JWT_RESET_SECRET + user.password;
        const resetToken = jwt.sign(
            { id: user.id },
            secret,
            {expiresIn: "10m"}  
        );

        // Gửi email
        await sendResetPasswordEmail(user, resetToken);

        await transaction.commit();

        return {
            err: 0,
            msg: 'Link đặt lại mật khẩu đã được gửi đến email của bạn!',
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const resetPasswordService = async (token, newPassword) => {
    try {
        // 1. Decode token (không verify) để lấy userId
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) {
             return { err: 1, msg: 'Invalid token format!' };
        }
        
        const userId = decoded.id;
        const user = await db.User.findByPk(userId);
        if (!user) {
            return {
                err: 1,
                msg: 'User not found!',
            };
        }

        // 2. Verify token với secret động (SECRET + password hiện tại)
        const secret = process.env.JWT_RESET_SECRET + user.password;
        
        try {
            jwt.verify(token, secret);
        } catch (error) {
             return {
                err: 1,
                msg: 'Token invalid or expired (link has been used)!',
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

//======================== ADMIN =========================== //
export const getAllUsersService = async (query={}) => {
    try {
        const { page, limit, hasPagination } = query;
        const { offset, limitNum, pageNum } = getPagination(page, limit, process.env.DEFAULT_PAGE_LIMIT);

        const { rows, count } = await db.User.findAndCountAll({
            paranoid: false, // bỏ qua soft delete
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: db.Role,
                    as: 'roles',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    where: { name: 'customer' }, // Chỉ lấy user có role 'customer'
                    required: true // INNER JOIN - bắt buộc phải có role 'customer'
                }
            ],
            order: [
                ['deletedAt', 'ASC'],
                ['createdAt', 'DESC']
            ],
            ...(hasPagination ? { offset, limit: limitNum } : {})
        });

        return {
            err: 0,
            msg: 'Get users successfully',
            response: formatPaginatedResponse(rows, count, hasPagination ? pageNum : null, hasPagination ? limitNum : null)
        };
    } catch (error) {
        throw error;
    }
};

export const updateUserRoleService = async (userId, roleIds = []) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findByPk(userId, { 
            include: [
                {
                    model: db.Role,
                    as: 'roles',
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            ],
            transaction 
        });

        if (!user) {
            await transaction.rollback();
            return {
                err: 1,
                msg: 'User not found!',
            };
        }

        // 🔥 Kiểm tra xem user hiện tại có phải admin không
        const isAdmin = user.roles?.some(role => role.name === 'admin');
        
        if (isAdmin) {
            await transaction.rollback();
            return {
                err: 1,
                msg: 'Không thể thay đổi quyền của admin!',
            };
        }

        // Kiểm tra role tồn tại
        const roles = await db.Role.findAll({
            where: { id: roleIds },
            transaction
        });

        if (roles.length !== roleIds.length) {
            await transaction.rollback();
            return {
                err: 1,
                msg: 'One or more roles not found!',
            };
        }

        //  Cập nhật role (xóa role cũ + set role mới)
        await user.setRoles(roles, { transaction });

        await transaction.commit();

        return {
            err: 0,
            msg: 'User roles updated successfully!',
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const softDeleteUserService = async (userId) => {
    try {
        const user = await db.User.findByPk(userId, {
            include: [
                {
                    model: db.Role,
                    as: 'roles',
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!user) {
            return {
                err: 1,
                msg: 'User not found!',
            };
        }

        // 🔥 Check admin role
        const isAdmin = user.roles?.some(role => role.name === 'admin');

        if (isAdmin) {
            return {
                err: 1,
                msg: 'Cannot delete admin user!',
            };
        }
        await user.destroy(); // soft delete

        return {
            err: 0,
            msg: 'User deleted successfully!',
        };
    } catch (error) {
        throw error;
    }
};
