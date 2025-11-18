import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class OrderItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            OrderItem.belongsTo(models.Order, { 
                foreignKey: 'orderId', 
                as: 'order' 
            });

            OrderItem.belongsTo(models.ProductVariant, { 
                foreignKey: 'productVariantId', 
                as: 'variant' 
            });

            OrderItem.hasMany(models.Review, { 
                foreignKey: 'orderItemId', 
                as: 'reviews', 
                onDelete: 'CASCADE' 
            });
        }
    }
    OrderItem.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productVariantId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        unitPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0,
            }
        },
    },
    {
        sequelize,
        modelName: 'OrderItem',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return OrderItem;
};