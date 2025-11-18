import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Review.belongsTo(models.User, { 
                foreignKey: 'userId', 
                as: 'user' 
            });
            Review.belongsTo(models.OrderItem, { 
                foreignKey: 'orderItemId', 
                as: 'orderItem' 
            });
            Review.hasMany(models.ReviewImage, {
                foreignKey: 'reviewId',
                as: 'reviewImages',
                onDelete: 'CASCADE',
            });
        }
    }
    Review.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        orderItemId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 5,
            },
        }
    },
    {
        sequelize,
        modelName: 'Review',
        paranoid: true,         
        deletedAt: 'deletedAt',
        indexes: [
            {
                unique: true,
                fields: ['orderItemId','userId'] // 1 user chỉ được review 1 lần / orderItem
            }
        ]
    });
    return Review;
};