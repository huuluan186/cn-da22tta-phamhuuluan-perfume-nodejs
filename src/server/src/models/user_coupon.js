import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class UserCoupon extends Model {
        static associate(models) {
            // Liên kết về User
            UserCoupon.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
                onDelete: 'CASCADE',
            });
            // Liên kết về Coupon
            UserCoupon.belongsTo(models.Coupon, {
                foreignKey: 'couponId',
                as: 'coupon',
                onDelete: 'CASCADE',
            });
        }
    }

    UserCoupon.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        couponId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('unused', 'used', 'expired'),
            defaultValue: 'unused',
        },
        validFrom: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        validUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'UserCoupon',
        indexes: [
            { unique: true, fields: ['userId', 'couponId'] }, // đảm bảo 1 user chỉ nhận 1 lần coupon
        ],
    });

    return UserCoupon;
};
