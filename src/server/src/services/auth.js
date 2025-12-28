import db from '../models/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {v4} from 'uuid'
import { autoCreateAndAssignCouponForUser } from './coupon.js'

if (!process.env.SECRET_KEY) {
    console.error('❌ Missing SECRET_KEY in .env');
    process.exit(1);
}

//hàm băm mật khẩu
const hashPassword = password => bcrypt.hashSync(password,bcrypt.genSaltSync(12))

export const registerService = async ({ firstname, lastname, password, email}, isSelfRegister = true) => {
    const transaction = await db.sequelize.transaction();
    try {
        // 1. Kiểm tra email có trùng hay không (bao gồm cả soft deleted)
        const existingUser = await db.User.findOne({ 
            where: { email }, 
            paranoid: false, // Tìm cả user đã xóa mềm
            transaction 
        });

        let newUser;

        if (existingUser) {
            // Nếu user đã bị xóa mềm -> Restore và cập nhật thông tin
            if (existingUser.deletedAt) {
                await existingUser.restore({ transaction });
                
                // Cập nhật thông tin mới
                newUser = await existingUser.update({
                    firstname,
                    lastname,
                    password: hashPassword(password),
                }, { transaction });
            } else {
                // Nếu user vẫn còn active -> Báo lỗi trùng email
                await transaction.rollback();
                return { err: 1, msg: 'Email đã được sử dụng!' };
            }
        } else {
            // 2. Nếu chưa có -> Tạo user mới
            newUser = await db.User.create(
                {
                    id: v4(),
                    firstname,
                    lastname,
                    email,
                    password: hashPassword(password),
                },
                { transaction }
            );
        }

        // 3. TÌM ROLE CUSTOMER RỒI GÁN
        const customerRole = await db.Role.findOne({
            where: { name: 'customer' }, // hoặc 'Customer', 'Khách hàng' – miễn đúng trong DB
            transaction
        });

        if (!customerRole) {
            await transaction.rollback();
            console.error('ROLE CUSTOMER KHÔNG TỒN TẠI TRONG DATABASE!');
            return { err: -1, msg: 'Hệ thống lỗi: Không tìm thấy vai trò khách hàng.' };
        }
        
        // Kiểm tra xem user đã có role này chưa (trường hợp restore)
        const hasRole = await newUser.hasRole(customerRole, { transaction });
        if (!hasRole) {
             await newUser.addRole(customerRole, { transaction });
        }

        // 4. Tự động gán WELCOME coupon cho user mới
        await autoCreateAndAssignCouponForUser(newUser.id, transaction);

        await transaction.commit();

        //Nếu admin tạo user từ dashboard -> không cần token
        if (!isSelfRegister) return { err: 0, msg: 'Tạo tài khoản thành công!' };
    
        //4. Tạo token - user mới chắc chắn có role customer
        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: '2d' }
        );

        return { err: 0, msg: 'Đăng ký tài khoản thành công!', token };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const loginService = async ({ email, password }) => {
    try {
        const response = await db.User.findOne({ where: {email} });
        if (!response) return ({ err: 1, msg: `Email không tồn tại!`, token: null });

        const isCorrectPassword = bcrypt.compareSync(password, response.password);
        if (!isCorrectPassword) return ({ err: 1, msg: 'Mật khẩu không đúng!', token: null });

        const token = jwt.sign(
            {
                id: response.id,
                email: response.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: '2d' }
        )

        return({ err: 0, msg: 'Đăng nhập thành công!', token })
    } catch (error) {
        throw error
    }
}

export const socialLoginService = async (payload) => {
    const transaction = await db.sequelize.transaction();
    try {
        //console.log('*** Social login payload:', payload);

        if (!payload.email || !payload.providerUserId) {
            await transaction.rollback();
            return { err: 1, msg: 'Missing required fields' };
        }

        // Kiểm tra có user chưa (bao gồm cả soft deleted)
        let user = await db.User.findOne({
            where: { email: payload.email },
            paranoid: false,
            transaction
        });

        if (!user) {
            // Nếu chưa có thì tạo user mới
            user = await db.User.create({
                id: payload.providerUserId, // tạm dùng ID Google
                firstname: payload.profile.displayName.split(' ')[0],
                lastname: payload.profile.displayName.split(' ').slice(1).join(' '),
                email: payload.email,
                password: hashPassword('social_login'), // placeholder
            }, { transaction });

            // GÁN ROLE CUSTOMER CHO USER MỚI
            const customerRole = await db.Role.findOne({
                where: { name: 'customer' },
                transaction
            });

            if (customerRole) await user.addRole(customerRole, { transaction });
            else console.warn('Role customer không tồn tại khi social login!');

            // Tự động gán WELCOME coupon cho user mới từ social login
            await autoCreateAndAssignCouponForUser(user.id, transaction);
            
        } else if (user.deletedAt) {
            // Nếu user tồn tại nhưng đã xóa mềm -> Restore
             await user.restore({ transaction });
             
             // Check role nếu cần (tương tự logic login thường, nhưng thường social login user đã có role trước đó)
              const customerRole = await db.Role.findOne({
                where: { name: 'customer' },
                transaction
            });
             const hasRole = await user.hasRole(customerRole, { transaction });
             if (!hasRole && customerRole) {
                  await user.addRole(customerRole, { transaction });
             }
        }

        // Kiểm tra AuthProvider (google/facebook)
        await db.AuthProvider.findOrCreate({
            where: { providerUserId: payload.providerUserId, provider: payload.provider },
            defaults: {
                id: payload.providerUserId,
                userId: user.id,
                email: payload.email,
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
            },
            transaction
        });

        await transaction.commit();

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        return { err: 0, msg: 'Đăng nhập thành công qua Auth Provider', token };
    } catch (error) {
        await transaction.rollback();
        console.error('Social login error:', error);
        return { err: 1, msg: 'Lỗi khi đăng nhập qua Auth Provider' };
    }
};