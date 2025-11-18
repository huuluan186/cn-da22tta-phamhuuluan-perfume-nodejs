import { Model } from 'sequelize';
import { productVariantHooks } from '../hooks/productVariantHooks.js';

export default (sequelize, DataTypes) => {
    class ProductVariant extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Mỗi biến thể thuộc về 1 sản phẩm
            ProductVariant.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product',
            });

            ProductVariant.hasMany(models.OrderItem, { 
                foreignKey: 'productVariantId', 
                as: 'orderItems', 
                onDelete: 'CASCADE' 
            });
        }
    }
    ProductVariant.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        volume: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0,
            }
        },
        originalPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,  
            validate: {
                min: 0,
            }          
        },
        discountPercent: {
            type: DataTypes.FLOAT, 
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            }
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
            },
            defaultValue: 0,
        },
        soldQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        weight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'ProductVariant',
        paranoid: true,         
        deletedAt: 'deletedAt',
        hooks: productVariantHooks,
    });
    return ProductVariant;
};