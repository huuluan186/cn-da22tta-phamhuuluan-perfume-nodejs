import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class CartItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    CartItem.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        cartId: {
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
                min: 1
            },
        },
        priceAtTime: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false, 
            validate: {
                min: 0,
            }
        }
    },
    {
        sequelize,
        modelName: 'CartItem',
    });
    return CartItem;
};