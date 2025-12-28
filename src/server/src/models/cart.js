import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            
            // 1 Cart thuộc về 1 User
            Cart.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',            
                onDelete: 'CASCADE',
            });

            // 1 Cart có nhiều CartItem
            Cart.hasMany(models.CartItem, {
                foreignKey: 'cartId',
                as: 'cartItems',
                onDelete: 'CASCADE',
            });
        }
    }
    Cart.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Cart',
    });
    return Cart;
};