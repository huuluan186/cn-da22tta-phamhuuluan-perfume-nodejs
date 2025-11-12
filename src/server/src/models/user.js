import { Model } from 'sequelize';
import { addSoftDeleteHook } from '../hooks/softDeleteHandler.js';

export default (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 1 User có nhiều Address
            User.hasMany(models.Address, {
                foreignKey: 'userId',   
                as: 'addresses',        
                onDelete: 'CASCADE',    
            });

            // 1 User có 1 Cart duy nhất
            User.hasOne(models.Cart, {
                foreignKey: 'userId',  
                as: 'cart',            
                onDelete: 'CASCADE',   
            });

            // 1 User có nhiều Order
            User.hasMany(models.Order, {
                foreignKey: 'userId',   
                as: 'orders',           
                onDelete: 'CASCADE',
            });

            // 1 User có nhiều AuthProvider (Google, Facebook,...)
            User.hasMany(models.AuthProvider, {
                foreignKey: 'userId',
                as: 'authProviders',
                onDelete: 'CASCADE',
            });

            // Nhiều User có thể có nhiều Role (qua bảng UserRole)
            User.belongsToMany(models.Role, {
                through: models.UserRole,
                foreignKey: 'userId',
                otherKey: 'roleId',
                as: 'roles',
                onDelete: 'CASCADE',
            });

            User.belongsToMany(models.Coupon, {
                through: 'UserCoupon', 
                foreignKey: 'userId',
                otherKey: 'couponId',
                as: 'coupons',
                onDelete: 'CASCADE',
            });
        }
    }
    User.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       // tự định nghĩa khóa chính
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,          
            validate: {
                isDate: true,         
            },
        },
        gender:{
            type: DataTypes.ENUM('male', 'female', 'other'), 
            allowNull: true,
            defaultValue: null
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,           // đảm bảo email không trùng
            validate: {
                isEmail: true,
            },
        },
    },
    {
        sequelize,
        modelName: 'User',
        paranoid: true,         // ✅ bật soft delete
        deletedAt: 'deletedAt', // ✅ Sequelize tự tạo cột này
    });
    return User;
};