import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Coupon extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Coupon.belongsToMany(models.User, {
                through: 'UserCoupon', 
                foreignKey: 'couponId',
                otherKey: 'userId',
                as: 'users',
                onDelete: 'CASCADE',
            });

        }
    }
    Coupon.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       // tự định nghĩa khóa chính
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,           
        },
        discountType: {
            type: DataTypes.ENUM('percentage', 'fixed'),
            allowNull: false,
            defaultValue: 'percentage',
        },
        discountValue: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0,
            }
        },
        expiredAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Coupon',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return Coupon;
};