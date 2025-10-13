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
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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